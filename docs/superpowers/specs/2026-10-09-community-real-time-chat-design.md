# Specification: Community Real-time Chat (TICKET-002)

## 1. Overview
Implement real-time chat and friend management to replace the current Frontend Firebase onSnapshot implementation. The backend will adopt a standard real-time architecture using MongoDB for persistent storage and WebSockets (Socket.io) for real-time event broadcasting. It supports strictly 1-on-1 chats.

## 2. Database Schemas (MongoDB)

Three new entities will be generated using the project's `generate` tool for document persistence:

### 2.1 FriendRequest
Tracks the lifecycle of friendship relationships.
- `sender`: Reference to `User`.
- `receiver`: Reference to `User`.
- `status`: String (`pending`, `accepted`, `declined`).

### 2.2 Conversation
Tracks 1-on-1 chat rooms.
- `participants`: Array of References to `User` (strictly 2 users).
- `lastMessage`: Reference to `Message` (optional, for displaying chat list).

### 2.3 Message
Tracks individual chat messages.
- `conversation`: Reference to `Conversation`.
- `sender`: Reference to `User`.
- `content`: String.
- `isRead`: Boolean (default `false`).

*Note:* Standard indexes will be applied on queries like `sender/receiver` in FriendRequest, and `conversation` in Message, to ensure fast direct collection querying (Option 1).

## 3. REST APIs

Two new modules will be created: `FriendsModule` and `ChatModule`.

### 3.1 Friends API (`/api/v1/friends`)
- `POST /request`: Send a friend request (payload: `receiverId`). Validates existing requests.
- `PATCH /request/:id/accept`: Accept a friend request. Automatically creates a `Conversation` if it doesn't already exist.
- `PATCH /request/:id/decline`: Decline a friend request.
- `GET /requests`: Get a list of pending requests (sent/received).
- `GET /`: Get the list of accepted friends.

### 3.2 Chat API (`/api/v1/chat`)
- `GET /conversations`: Fetch the paginated list of conversations for the current user, populated with `lastMessage` and the other participant. Sorted by `updatedAt` (or `lastMessage.createdAt`) descending.
- `GET /conversations/:id/messages`: Fetch the paginated message history for a specific conversation. Validates that the requesting user is a participant.

## 4. WebSocket Gateway

A new `ChatGateway` will be implemented within the `ChatModule`.

### 4.1 Connection Management
- Uses standard `@nestjs/platform-socket.io`.
- Authenticates socket connections using the existing JWT logic via socket handshake (`socket.handshake.auth.token`). Rejects unauthorized connections.
- Uses an in-memory `Map<string, string>` to map `userId` to `socketId` for targeted message delivery.

### 4.2 Events
- **Listen:** `@SubscribeMessage('sendMessage')`
  - Validates payload (`conversationId`, `content`).
  - Persists the new `Message` to MongoDB.
  - Updates the `Conversation`'s `lastMessage`.
- **Broadcast:**
  - Emits `receiveMessage` to the target user's `socketId` instantly.
  - Emits `friendRequestReceived` and `friendRequestAccepted` real-time events when friends actions occur.

## 5. Security & Integrity
- All REST endpoints protected by `JwtGuard`.
- All socket events protected by authentication on connection.
- Users can only query messages from conversations they are a part of.
- Users can only message accepted friends.