import { Conversation } from '../../../../domain/conversation';
import { MessageMapper } from '../../../../../messages/infrastructure/persistence/document/mappers/message.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';

import { ConversationSchemaClass } from '../entities/conversation.schema';

export class ConversationMapper {
  public static toDomain(raw: ConversationSchemaClass): Conversation {
    const domainEntity = new Conversation();
    if (raw.lastMessage) {
      domainEntity.lastMessage = MessageMapper.toDomain(raw.lastMessage);
    }

    if (raw.participants) {
      domainEntity.participants = raw.participants.map((item) =>
        UserMapper.toDomain(item),
      );
    }

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: Conversation,
  ): ConversationSchemaClass {
    const persistenceSchema = new ConversationSchemaClass();
    if (domainEntity.lastMessage) {
      persistenceSchema.lastMessage = MessageMapper.toPersistence(
        domainEntity.lastMessage,
      );
    }

    if (domainEntity.participants) {
      persistenceSchema.participants = domainEntity.participants.map((item) =>
        UserMapper.toPersistence(item),
      );
    }

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
