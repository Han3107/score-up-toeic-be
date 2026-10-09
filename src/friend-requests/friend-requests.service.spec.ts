import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestsService } from './friend-requests.service';
import { UsersService } from '../users/users.service';
import { FriendRequestRepository } from './infrastructure/persistence/friend-request.repository';
import { ConversationRepository } from '../conversations/infrastructure/persistence/conversation.repository';
import { ChatGateway } from '../chat/chat.gateway';

describe('FriendRequestsService', () => {
  let service: FriendRequestsService;

  const mockFriendRequestRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    areFriends: jest.fn(),
    findPendingRequests: jest.fn(),
    findFriends: jest.fn(),
  };

  const mockConversationRepository = {
    create: jest.fn(),
    findByParticipants: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockChatGateway = {
    server: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendRequestsService,
        { provide: UsersService, useValue: mockUsersService },
        {
          provide: FriendRequestRepository,
          useValue: mockFriendRequestRepository,
        },
        {
          provide: ConversationRepository,
          useValue: mockConversationRepository,
        },
        {
          provide: ChatGateway,
          useValue: mockChatGateway,
        },
      ],
    }).compile();

    service = module.get<FriendRequestsService>(FriendRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should accept a friend request and create a conversation', async () => {
    mockFriendRequestRepository.findById.mockResolvedValue({
      id: 'req1',
      sender: { id: 'user1' },
      receiver: { id: 'user2' },
      status: 'pending',
    });
    mockFriendRequestRepository.update.mockResolvedValue({
      id: 'req1',
      status: 'accepted',
      sender: { id: 'user1' },
      receiver: { id: 'user2' },
    });
    mockConversationRepository.findByParticipants.mockResolvedValue(null);
    mockConversationRepository.create.mockResolvedValue({
      id: 'conv1',
      participants: [{ id: 'user1' }, { id: 'user2' }],
    });

    const result = await service.accept('req1', 'user2');
    expect(result).toBeDefined();
    expect(result?.status).toBe('accepted');
    expect(mockConversationRepository.create).toHaveBeenCalledWith({
      participants: [{ id: 'user1' }, { id: 'user2' }],
    });
    expect(mockChatGateway.server.to).toHaveBeenCalledWith('user1');
    expect(mockChatGateway.server.emit).toHaveBeenCalledWith(
      'friendRequestAccepted',
      result,
    );
  });

  it('should not create a conversation if one already exists', async () => {
    mockFriendRequestRepository.findById.mockResolvedValue({
      id: 'req1',
      sender: { id: 'user1' },
      receiver: { id: 'user2' },
      status: 'pending',
    });
    mockFriendRequestRepository.update.mockResolvedValue({
      id: 'req1',
      status: 'accepted',
      sender: { id: 'user1' },
      receiver: { id: 'user2' },
    });
    mockConversationRepository.findByParticipants.mockResolvedValue({
      id: 'conv1',
      participants: [{ id: 'user1' }, { id: 'user2' }],
    });

    await service.accept('req1', 'user2');
    expect(mockConversationRepository.create).not.toHaveBeenCalled();
  });

  it('should throw an error if accepting a non-pending or already accepted request', async () => {
    mockFriendRequestRepository.findById.mockResolvedValue({
      id: 'req2',
      status: 'accepted',
    });
    await expect(service.accept('req2', 'user2')).rejects.toThrow();
  });
});
