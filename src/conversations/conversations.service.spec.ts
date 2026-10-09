import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from './infrastructure/persistence/conversation.repository';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';

describe('ConversationsService', () => {
  let service: ConversationsService;

  const mockConversationRepo = {
    findById: jest.fn(),
    findByParticipantWithPagination: jest.fn(),
  };

  const mockMessagesService = {
    findByConversationWithPagination: jest.fn(),
  };

  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: ConversationRepository, useValue: mockConversationRepo },
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
  });

  describe('findByParticipantWithPagination', () => {
    it('should call repository method and return conversations', async () => {
      const mockResult = [{ id: 'conv1' }, { id: 'conv2' }];
      mockConversationRepo.findByParticipantWithPagination.mockResolvedValue(
        mockResult,
      );

      const result = await service.findByParticipantWithPagination('user1', {
        page: 1,
        limit: 10,
      });
      expect(
        mockConversationRepo.findByParticipantWithPagination,
      ).toHaveBeenCalledWith('user1', { page: 1, limit: 10 });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findMessagesByConversation', () => {
    it('should throw NotFoundException if conversation does not exist', async () => {
      mockConversationRepo.findById.mockResolvedValue(null);
      await expect(
        service.findMessagesByConversation('conv1', 'user1', {
          page: 1,
          limit: 10,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not part of the conversation when fetching messages', async () => {
      mockConversationRepo.findById.mockResolvedValue({
        id: 'conv1',
        participants: [{ id: 'user1' }, { id: 'user2' }],
      });
      await expect(
        service.findMessagesByConversation('conv1', 'user3', {
          page: 1,
          limit: 10,
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return messages if user is a participant', async () => {
      mockConversationRepo.findById.mockResolvedValue({
        id: 'conv1',
        participants: [{ id: 'user1' }, { id: 'user2' }],
      });
      mockMessagesService.findByConversationWithPagination.mockResolvedValue([
        { id: 'msg1' },
      ]);
      const result = await service.findMessagesByConversation(
        'conv1',
        'user1',
        {
          page: 1,
          limit: 10,
        },
      );
      expect(result).toEqual([{ id: 'msg1' }]);
      expect(
        mockMessagesService.findByConversationWithPagination,
      ).toHaveBeenCalledWith('conv1', { page: 1, limit: 10 });
    });
  });
});
