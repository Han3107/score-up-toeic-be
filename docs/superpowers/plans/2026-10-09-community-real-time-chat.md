# Community Real-time Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real-time chat and friend management using MongoDB and WebSockets (Socket.io).

**Architecture:** We use 3 new MongoDB collections (FriendRequest, Conversation, Message) for persistence. Two new REST modules manage friends and fetch chat history. A WebSocket gateway handles real-time messaging, persisting to DB before broadcasting to the connected socket.

**Tech Stack:** NestJS, Mongoose (MongoDB), `@nestjs/websockets`, `socket.io`

**Spec:** `docs/superpowers/specs/2026-10-09-community-real-time-chat-design.md`

## Global Constraints

- The backend will adopt a standard real-time architecture using MongoDB for persistent storage and WebSockets (Socket.io).
- Strictly 1-on-1 chats.
- Users can only message accepted friends.

## Review Focus

- Invalid JWT tokens connecting to WebSocket -> Should be rejected immediately.
  - Add test in ChatGateway tests to verify rejection logic.
- Sending a message to a user who is not a friend -> Should fail and not be persisted.
  - Add test in ChatGateway tests to verify friend validation.
- Fetching messages for a conversation the user is not part of -> Should return 403 Forbidden.
  - Add test in ConversationsService tests to check participant verification.
- Accepting a friend request multiple times -> Should handle gracefully or error, but not create multiple duplicate conversations.
  - Add test in FriendRequestsService to verify idempotency or error state.
- WebSocket message persistence failure -> Should not broadcast the message if DB save fails.
  - Add test in ChatGateway to ensure emit is called only after successful DB save.

---

### Task 1: Scaffolding and Schemas

**Files:**
- Create: Schemas and modules for `FriendRequest`, `Conversation`, `Message`
- Modify: `package.json` (install dependencies)

**Interfaces:**
- Consumes: Existing `User` schema
- Produces: Base CRUD REST endpoints and schemas.

- [ ] **Step 1: Install WebSocket dependencies**

```bash
npm install @nestjs/platform-socket.io @nestjs/websockets socket.io
```

- [ ] **Step 2: Generate FriendRequest Entity and Properties**

```bash
npm run generate:resource:document -- --name FriendRequest
npm run add:property:to-document -- --name FriendRequest --property sender --kind reference --type User --shouldAutoLoad true
npm run add:property:to-document -- --name FriendRequest --property receiver --kind reference --type User --shouldAutoLoad true
npm run add:property:to-document -- --name FriendRequest --property status --kind primitive --type string
```

- [ ] **Step 3: Generate Conversation Entity and Properties**

```bash
npm run generate:resource:document -- --name Conversation
npm run add:property:to-document -- --name Conversation --property participants --kind reference --type User --shouldAutoLoad true
npm run add:property:to-document -- --name Conversation --property lastMessage --kind reference --type Message --shouldAutoLoad true
```
*(Note: If the generator defaults to single-reference for User, manually change `participants` to `[UserSchemaClass]` in `conversation.schema.ts` later).*

- [ ] **Step 4: Generate Message Entity and Properties**

```bash
npm run generate:resource:document -- --name Message
npm run add:property:to-document -- --name Message --property conversation --kind reference --type Conversation --shouldAutoLoad false
npm run add:property:to-document -- --name Message --property sender --kind reference --type User --shouldAutoLoad true
npm run add:property:to-document -- --name Message --property content --kind primitive --type string
npm run add:property:to-document -- --name Message --property isRead --kind primitive --type boolean
```

- [ ] **Step 5: Verify App Compilation and Commit**

```bash
npm run build
git add .
git commit -m "feat(chat): scaffold FriendRequest, Conversation, Message schemas and install WS"
```

### Task 2: Implement FriendRequests Logic (REST)

**Files:**
- Create: `src/friend-requests/friend-requests.service.spec.ts`
- Modify: `src/friend-requests/friend-requests.service.ts`
- Modify: `src/friend-requests/friend-requests.controller.ts`

**Interfaces:**
- Consumes: `FriendRequest` and `Conversation` repositories.
- Produces: `acceptFriendRequest` method which creates a `Conversation`.

- [ ] **Step 1: Write failing tests for FriendRequestsService**

Create `src/friend-requests/friend-requests.service.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestsService } from './friend-requests.service';

describe('FriendRequestsService', () => {
  let service: FriendRequestsService;

  const mockFriendRequestRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockConversationRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestsService,
        { provide: 'FriendRequestRepository', useValue: mockFriendRequestRepository },
        { provide: 'ConversationRepository', useValue: mockConversationRepository },
      ],
    }).compile();

    service = module.get<FriendRequestsService>(FriendRequestsService);
  });

  it('should accept a friend request and create a conversation', async () => {
    mockFriendRequestRepository.findById.mockResolvedValue({ id: 'req1', sender: { id: 'user1' }, receiver: { id: 'user2' }, status: 'pending' });
    mockFriendRequestRepository.update.mockResolvedValue({ id: 'req1', status: 'accepted' });
    mockConversationRepository.create.mockResolvedValue({ id: 'conv1', participants: ['user1', 'user2'] });

    const result = await service.accept('req1', 'user2');
    expect(result.status).toBe('accepted');
    expect(mockConversationRepository.create).toHaveBeenCalled();
  });

  it('should throw an error if accepting a non-pending or already accepted request', async () => {
    mockFriendRequestRepository.findById.mockResolvedValue({ id: 'req2', status: 'accepted' });
    await expect(service.accept('req2', 'user2')).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- src/friend-requests/friend-requests.service.spec.ts
```
Expected: FAIL due to missing `accept` method.

- [ ] **Step 3: Implement minimal logic in service and controller**

```typescript
// In src/friend-requests/friend-requests.service.ts
async accept(id: string, receiverId: string) {
  const request = await this.friendRequestRepo.findById(id);
  if (!request || request.status !== 'pending' || request.receiver.id !== receiverId) {
    throw new Error('Invalid request');
  }
  
  const updated = await this.friendRequestRepo.update(id, { status: 'accepted' });
  await this.conversationRepo.create({ participants: [request.sender.id, receiverId] });
  return updated;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- src/friend-requests/friend-requests.service.spec.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/friend-requests/
git commit -m "feat(friends): implement accept request and conversation creation"
```

### Task 3: Implement Conversations & Messages Logic (REST)

**Files:**
- Create: `src/conversations/conversations.service.spec.ts`
- Modify: `src/conversations/conversations.service.ts`
- Modify: `src/messages/messages.service.ts`

**Interfaces:**
- Consumes: `ConversationRepository`, `MessageRepository`.
- Produces: `findMessagesByConversation(conversationId, userId)` method ensuring security.

- [ ] **Step 1: Write failing test for ConversationsService**

Create `src/conversations/conversations.service.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { ForbiddenException } from '@nestjs/common';

describe('ConversationsService', () => {
  let service: ConversationsService;

  const mockConversationRepo = {
    findById: jest.fn(),
  };

  const mockMessageRepo = {
    findByConversation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: 'ConversationRepository', useValue: mockConversationRepo },
        { provide: 'MessageRepository', useValue: mockMessageRepo },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  it('should throw ForbiddenException if user is not part of the conversation when fetching messages', async () => {
    mockConversationRepo.findById.mockResolvedValue({ id: 'conv1', participants: [{ id: 'user1' }, { id: 'user2' }] });
    await expect(service.getMessages('conv1', 'user3')).rejects.toThrow(ForbiddenException);
  });

  it('should return messages if user is a participant', async () => {
    mockConversationRepo.findById.mockResolvedValue({ id: 'conv1', participants: [{ id: 'user1' }, { id: 'user2' }] });
    mockMessageRepo.findByConversation.mockResolvedValue([{ id: 'msg1' }]);
    const result = await service.getMessages('conv1', 'user1');
    expect(result).toEqual([{ id: 'msg1' }]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- src/conversations/conversations.service.spec.ts
```
Expected: FAIL

- [ ] **Step 3: Implement minimal logic in service**

```typescript
// In src/conversations/conversations.service.ts
async getMessages(conversationId: string, userId: string) {
  const conversation = await this.conversationRepo.findById(conversationId);
  const isParticipant = conversation.participants.some(p => p.id === userId);
  if (!isParticipant) {
    throw new ForbiddenException('Not a participant');
  }
  return this.messageRepo.findByConversation(conversationId);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- src/conversations/conversations.service.spec.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/conversations/ src/messages/
git commit -m "feat(chat): implement secure message fetching logic"
```

### Task 4: WebSocket ChatGateway

**Files:**
- Create: `src/chat/chat.module.ts`, `src/chat/chat.gateway.ts`, `src/chat/chat.gateway.spec.ts`
- Modify: `src/app.module.ts` (import `ChatModule`)

**Interfaces:**
- Consumes: `MessagesService` (to save messages), `JwtService` (to authenticate sockets), `FriendRequestsService` (to validate friendship).
- Produces: WebSocket endpoint.

- [ ] **Step 1: Write failing test for ChatGateway**

Create `src/chat/chat.gateway.spec.ts`:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { WsException } from '@nestjs/websockets';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockJwtService = { verifyAsync: jest.fn() };
  let mockMessagesService = { create: jest.fn() };
  let mockFriendRequestsService = { areFriends: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: 'JwtService', useValue: mockJwtService },
        { provide: 'MessagesService', useValue: mockMessagesService },
        { provide: 'FriendRequestsService', useValue: mockFriendRequestsService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should reject unauthenticated connections', async () => {
    const client = { handshake: { auth: {} }, disconnect: jest.fn() } as any;
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
    await gateway.handleConnection(client);
    expect(client.disconnect).toHaveBeenCalled();
  });

  it('should not emit if saving message fails', async () => {
    const client = { id: 'socket1', data: { user: { id: 'user1' } } } as any;
    mockFriendRequestsService.areFriends.mockResolvedValue(true);
    mockMessagesService.create.mockRejectedValue(new Error('DB Error'));
    const server = { to: jest.fn().mockReturnThis(), emit: jest.fn() };
    gateway.server = server as any;

    await expect(gateway.handleSendMessage(client, { conversationId: 'conv1', content: 'hello', receiverId: 'user2' })).rejects.toThrow();
    expect(server.emit).not.toHaveBeenCalled();
  });

  it('should throw WsException if users are not friends', async () => {
    const client = { id: 'socket1', data: { user: { id: 'user1' } } } as any;
    mockFriendRequestsService.areFriends.mockResolvedValue(false);
    await expect(gateway.handleSendMessage(client, { conversationId: 'conv1', content: 'hello', receiverId: 'user2' })).rejects.toThrow(WsException);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- src/chat/chat.gateway.spec.ts
```
Expected: FAIL

- [ ] **Step 3: Implement minimal ChatGateway**

```typescript
// In src/chat/chat.gateway.ts
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private connectedUsers = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
    private friendRequestsService: FriendRequestsService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      this.connectedUsers.set(payload.id, client.id);
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: { conversationId: string, content: string, receiverId: string }) {
    const senderId = client.data.user.id;
    const areFriends = await this.friendRequestsService.areFriends(senderId, payload.receiverId);
    if (!areFriends) throw new WsException('Not friends');

    const message = await this.messagesService.create({
      conversationId: payload.conversationId,
      senderId,
      content: payload.content,
      isRead: false
    });

    const receiverSocketId = this.connectedUsers.get(payload.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', message);
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm run test -- src/chat/chat.gateway.spec.ts
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/chat/ src/app.module.ts
git commit -m "feat(chat): implement websocket gateway for real-time messaging"
```