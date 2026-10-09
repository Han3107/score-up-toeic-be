import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { FriendRequestsService } from '../friend-requests/friend-requests.service';
import { ConversationsService } from '../conversations/conversations.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  const mockJwtService = { verifyAsync: jest.fn() };
  const mockMessagesService = { create: jest.fn() };
  const mockFriendRequestsService = { areFriends: jest.fn() };
  const mockConversationsService = { findById: jest.fn(), update: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: FriendRequestsService, useValue: mockFriendRequestsService },
        { provide: ConversationsService, useValue: mockConversationsService },
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
    mockConversationsService.findById.mockResolvedValue({
      id: 'conv1',
      participants: [{ id: 'user1' }, { id: 'user2' }],
    });
    mockMessagesService.create.mockRejectedValue(new Error('DB Error'));
    const server = { to: jest.fn().mockReturnThis(), emit: jest.fn() };
    gateway.server = server as any;

    await expect(
      gateway.handleSendMessage(client, {
        conversationId: 'conv1',
        content: 'hello',
        receiverId: 'user2',
      }),
    ).rejects.toThrow();
    expect(server.emit).not.toHaveBeenCalled();
  });

  it('should throw WsException if users are not friends', async () => {
    const client = { id: 'socket1', data: { user: { id: 'user1' } } } as any;
    mockFriendRequestsService.areFriends.mockResolvedValue(false);
    await expect(
      gateway.handleSendMessage(client, {
        conversationId: 'conv1',
        content: 'hello',
        receiverId: 'user2',
      }),
    ).rejects.toThrow(WsException);
  });

  it('should throw WsException if sender is not participant in the conversation', async () => {
    const client = { id: 'socket1', data: { user: { id: 'user1' } } } as any;
    mockFriendRequestsService.areFriends.mockResolvedValue(true);
    mockConversationsService.findById.mockResolvedValue({
      id: 'conv1',
      participants: [{ id: 'user3' }, { id: 'user2' }], // user1 is missing
    });

    await expect(
      gateway.handleSendMessage(client, {
        conversationId: 'conv1',
        content: 'hello',
        receiverId: 'user2',
      }),
    ).rejects.toThrow(WsException);
  });

  it('should authenticate user and join room on connection', async () => {
    const client = {
      id: 'socket1',
      handshake: { auth: { token: 'valid-token' } },
      data: {},
      join: jest.fn(),
    } as any;
    mockJwtService.verifyAsync.mockResolvedValue({ id: 'user1' });
    await gateway.handleConnection(client);
    expect(client.join).toHaveBeenCalledWith('user1');
    expect(client.data.user).toEqual({ id: 'user1' });
  });

  it('should not throw on disconnect', () => {
    expect(() => gateway.handleDisconnect()).not.toThrow();
  });
});
