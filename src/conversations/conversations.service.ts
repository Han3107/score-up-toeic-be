import { MessagesService } from '../messages/messages.service';
import { Message } from '../messages/domain/message';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationRepository } from './infrastructure/persistence/conversation.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Conversation } from './domain/conversation';

@Injectable()
export class ConversationsService {
  constructor(
    @Inject(forwardRef(() => MessagesService))
    private readonly messageService: MessagesService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    // Do not remove comment below.
    // <creating-property />
    let lastMessage: Message | undefined = undefined;

    if (createConversationDto.lastMessage) {
      const lastMessageObject = await this.messageService.findById(
        createConversationDto.lastMessage.id,
      );
      if (!lastMessageObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            lastMessage: 'notExists',
          },
        });
      }
      lastMessage = lastMessageObject;
    }

    let participants: User[] | undefined = undefined;

    if (createConversationDto.participants) {
      const participantsObjects = await this.userService.findByIds(
        createConversationDto.participants.map((entity) => entity.id),
      );
      if (
        participantsObjects.length !== createConversationDto.participants.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            participants: 'notExists',
          },
        });
      }
      participants = participantsObjects;
    }

    return this.conversationRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      lastMessage,

      participants,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.conversationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Conversation['id']) {
    return this.conversationRepository.findById(id);
  }

  findByIds(ids: Conversation['id'][]) {
    return this.conversationRepository.findByIds(ids);
  }

  async update(
    id: Conversation['id'],

    updateConversationDto: UpdateConversationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let lastMessage: Message | undefined = undefined;

    if (updateConversationDto.lastMessage) {
      const lastMessageObject = await this.messageService.findById(
        updateConversationDto.lastMessage.id,
      );
      if (!lastMessageObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            lastMessage: 'notExists',
          },
        });
      }
      lastMessage = lastMessageObject;
    }

    let participants: User[] | undefined = undefined;

    if (updateConversationDto.participants) {
      const participantsObjects = await this.userService.findByIds(
        updateConversationDto.participants.map((entity) => entity.id),
      );
      if (
        participantsObjects.length !== updateConversationDto.participants.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            participants: 'notExists',
          },
        });
      }
      participants = participantsObjects;
    }

    return this.conversationRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      lastMessage,

      participants,
    });
  }

  remove(id: Conversation['id']) {
    return this.conversationRepository.remove(id);
  }
}
