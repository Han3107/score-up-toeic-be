import { FriendRequest } from '../../../../domain/friend-request';

import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';

import { FriendRequestSchemaClass } from '../entities/friend-request.schema';

export class FriendRequestMapper {
  public static toDomain(raw: FriendRequestSchemaClass): FriendRequest {
    const domainEntity = new FriendRequest();
    domainEntity.status = raw.status;

    if (raw.receiver) {
      domainEntity.receiver = UserMapper.toDomain(raw.receiver);
    }

    if (raw.sender) {
      domainEntity.sender = UserMapper.toDomain(raw.sender);
    }

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: FriendRequest,
  ): FriendRequestSchemaClass {
    const persistenceSchema = new FriendRequestSchemaClass();
    persistenceSchema.status = domainEntity.status;

    if (domainEntity.receiver) {
      persistenceSchema.receiver = UserMapper.toPersistence(
        domainEntity.receiver,
      );
    }

    if (domainEntity.sender) {
      persistenceSchema.sender = UserMapper.toPersistence(domainEntity.sender);
    }

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
