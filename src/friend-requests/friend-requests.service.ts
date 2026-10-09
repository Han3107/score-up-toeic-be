import { UsersService } from '../users/users.service';

import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { FriendRequestRepository } from './infrastructure/persistence/friend-request.repository';
import { ConversationRepository } from '../conversations/infrastructure/persistence/conversation.repository';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class FriendRequestsService {
  constructor(
    private readonly userService: UsersService,
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly conversationRepository: ConversationRepository,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
  ) {}

  async createRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new UnprocessableEntityException(
        'Cannot send friend request to yourself',
      );
    }

    const receiverObject = await this.userService.findById(receiverId);
    if (!receiverObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          receiver: 'notExists',
        },
      });
    }

    const senderObject = await this.userService.findById(senderId);
    if (!senderObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          sender: 'notExists',
        },
      });
    }

    const areFriends = await this.friendRequestRepository.areFriends(
      senderId,
      receiverId,
    );
    if (areFriends) {
      throw new UnprocessableEntityException('Already friends');
    }

    const request = await this.friendRequestRepository.create({
      status: 'pending',
      receiver: receiverObject,
      sender: senderObject,
    });

    // Emit event
    this.chatGateway.server
      .to(receiverId)
      .emit('friendRequestReceived', request);

    return request;
  }

  async accept(id: string, currentUserId: string) {
    const request = await this.friendRequestRepository.findById(id);
    if (
      !request ||
      request.status !== 'pending' ||
      request.receiver?.id !== currentUserId
    ) {
      throw new UnprocessableEntityException('Invalid friend request');
    }

    const updated = await this.friendRequestRepository.update(id, {
      status: 'accepted',
    });

    if (updated && request.sender && request.receiver) {
      const senderId = request.sender.id.toString();
      const receiverId = request.receiver.id.toString();

      if (senderId && receiverId) {
        let conversation = await this.conversationRepository.findByParticipants(
          senderId,
          receiverId,
        );

        if (!conversation) {
          conversation = await this.conversationRepository.create({
            participants: [request.sender, request.receiver],
          });
        }
      }

      // Emit event
      if (senderId) {
        this.chatGateway.server
          .to(senderId)
          .emit('friendRequestAccepted', updated);
      }
    }

    return updated;
  }

  async decline(id: string, currentUserId: string) {
    const request = await this.friendRequestRepository.findById(id);
    if (
      !request ||
      request.status !== 'pending' ||
      request.receiver?.id !== currentUserId
    ) {
      throw new UnprocessableEntityException('Invalid friend request');
    }

    return this.friendRequestRepository.update(id, {
      status: 'declined',
    });
  }

  async getPendingRequests(userId: string) {
    // Need to find by sender or receiver where status is pending
    // As per the boilerplate, we can use model directly or add to repo.
    // Let's add a repo method if it doesn't exist, or just use what we have.
    // Wait, the boilerplate's FriendRequestRepository only has findAllWithPagination.
    // I will add a method for this in the repository.
    return this.friendRequestRepository.findPendingRequests(userId);
  }

  async areFriends(user1Id: string, user2Id: string): Promise<boolean> {
    return this.friendRequestRepository.areFriends(user1Id, user2Id);
  }

  async getFriends(userId: string) {
    return this.friendRequestRepository.findFriends(userId);
  }
}
