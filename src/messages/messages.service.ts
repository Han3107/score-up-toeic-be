import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { ConversationsService } from '../conversations/conversations.service';
import { Conversation } from '../conversations/domain/conversation';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageRepository } from './infrastructure/persistence/message.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Message } from './domain/message';

@Injectable()
export class MessagesService {
  constructor(
    private readonly userService: UsersService,

    @Inject(forwardRef(() => ConversationsService))
    private readonly conversationService: ConversationsService,

    // Dependencies here
    private readonly messageRepository: MessageRepository,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    // Do not remove comment below.
    // <creating-property />

    let sender: User | undefined = undefined;

    if (createMessageDto.sender) {
      const senderObject = await this.userService.findById(
        createMessageDto.sender.id,
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

    let conversation: Conversation | undefined = undefined;

    if (createMessageDto.conversation) {
      const conversationObject = await this.conversationService.findById(
        createMessageDto.conversation.id,
      );
      if (!conversationObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            conversation: 'notExists',
          },
        });
      }
      conversation = conversationObject;
    }

    return this.messageRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      isRead: createMessageDto.isRead,

      content: createMessageDto.content,

      sender,

      conversation,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.messageRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Message['id']) {
    return this.messageRepository.findById(id);
  }

  findByIds(ids: Message['id'][]) {
    return this.messageRepository.findByIds(ids);
  }

  async update(
    id: Message['id'],

    updateMessageDto: UpdateMessageDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let sender: User | undefined = undefined;

    if (updateMessageDto.sender) {
      const senderObject = await this.userService.findById(
        updateMessageDto.sender.id,
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

    let conversation: Conversation | undefined = undefined;

    if (updateMessageDto.conversation) {
      const conversationObject = await this.conversationService.findById(
        updateMessageDto.conversation.id,
      );
      if (!conversationObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            conversation: 'notExists',
          },
        });
      }
      conversation = conversationObject;
    }

    return this.messageRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      isRead: updateMessageDto.isRead,

      content: updateMessageDto.content,

      sender,

      conversation,
    });
  }

  remove(id: Message['id']) {
    return this.messageRepository.remove(id);
  }
}
