import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequestRepository } from './infrastructure/persistence/friend-request.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { FriendRequest } from './domain/friend-request';
import { ConversationRepository } from '../conversations/infrastructure/persistence/conversation.repository';

@Injectable()
export class FriendRequestsService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async create(createFriendRequestDto: CreateFriendRequestDto) {
    // Do not remove comment below.
    // <creating-property />

    let receiver: User | undefined = undefined;

    if (createFriendRequestDto.receiver) {
      const receiverObject = await this.userService.findById(
        createFriendRequestDto.receiver.id,
      );
      if (!receiverObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            receiver: 'notExists',
          },
        });
      }
      receiver = receiverObject;
    }

    let sender: User | undefined = undefined;

    if (createFriendRequestDto.sender) {
      const senderObject = await this.userService.findById(
        createFriendRequestDto.sender.id,
      );
      if (!senderObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            sender: 'notExists',
          },
        });
      }
      sender = senderObject;
    }

    return this.friendRequestRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      status: createFriendRequestDto.status,

      receiver,

      sender,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.friendRequestRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: FriendRequest['id']) {
    return this.friendRequestRepository.findById(id);
  }

  findByIds(ids: FriendRequest['id'][]) {
    return this.friendRequestRepository.findByIds(ids);
  }

  async accept(id: string, receiverId: string) {
    const request = await this.friendRequestRepository.findById(id);
    if (
      !request ||
      request.status !== 'pending' ||
      request.receiver?.id !== receiverId
    ) {
      throw new UnprocessableEntityException('Invalid friend request');
    }

    const updated = await this.friendRequestRepository.update(id, {
      status: 'accepted',
    });
    if (updated && request.sender && request.receiver) {
      await this.conversationRepository.create({
        participants: [request.sender, request.receiver],
      });
    }

    return updated;
  }

  async update(
    id: FriendRequest['id'],

    updateFriendRequestDto: UpdateFriendRequestDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let receiver: User | undefined = undefined;

    if (updateFriendRequestDto.receiver) {
      const receiverObject = await this.userService.findById(
        updateFriendRequestDto.receiver.id,
      );
      if (!receiverObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            receiver: 'notExists',
          },
        });
      }
      receiver = receiverObject;
    }

    let sender: User | undefined = undefined;

    if (updateFriendRequestDto.sender) {
      const senderObject = await this.userService.findById(
        updateFriendRequestDto.sender.id,
      );
      if (!senderObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            sender: 'notExists',
          },
        });
      }
      sender = senderObject;
    }

    return this.friendRequestRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      status: updateFriendRequestDto.status,

      receiver,

      sender,
    });
  }

  remove(id: FriendRequest['id']) {
    return this.friendRequestRepository.remove(id);
  }
}
