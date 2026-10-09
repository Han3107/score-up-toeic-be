import { Message } from '../../../../domain/message';

import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';

import { Conversation } from '../../../../../conversations/domain/conversation';

import { MessageSchemaClass } from '../entities/message.schema';

export class MessageMapper {
  public static toDomain(raw: MessageSchemaClass): Message {
    const domainEntity = new Message();
    domainEntity.isRead = raw.isRead;

    domainEntity.content = raw.content;

    if (raw.sender) {
      domainEntity.sender = UserMapper.toDomain(raw.sender);
    }

    if (raw.conversation) {
      const conversationDomain = new Conversation();
      conversationDomain.id = raw.conversation.toString();
      domainEntity.conversation = conversationDomain;
    }

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Message): MessageSchemaClass {
    const persistenceSchema = new MessageSchemaClass();
    persistenceSchema.isRead = domainEntity.isRead;

    persistenceSchema.content = domainEntity.content;

    if (domainEntity.sender) {
      persistenceSchema.sender = UserMapper.toPersistence(domainEntity.sender);
    }

    if (domainEntity.conversation) {
      persistenceSchema.conversation = domainEntity.conversation.id.toString();
    }

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
