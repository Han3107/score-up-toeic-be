import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestsService } from './friend-requests.service';
import { UsersService } from '../users/users.service';
import { FriendRequestRepository } from './infrastructure/persistence/friend-request.repository';
import { ConversationRepository } from '../conversations/infrastructure/persistence/conversation.repository';

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

  const mockUsersService = {
    findById: jest.fn(),
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
    });
    mockConversationRepository.create.mockResolvedValue({
      id: 'conv1',
      participants: ['user1', 'user2'],
    });

    const result = await service.accept('req1', 'user2');
    expect(result).toBeDefined();
    expect(result?.status).toBe('accepted');
    expect(mockConversationRepository.create).toHaveBeenCalled();
  });

  it('should throw an error if accepting a non-pending or already accepted request', async () => {
    mockFriendRequestRepository.findById.mockResolvedValue({
      id: 'req2',
      status: 'accepted',
    });
    await expect(service.accept('req2', 'user2')).rejects.toThrow();
  });
});
