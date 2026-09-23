import { ToeicTest } from '../../../../domain/toeic-test';

import { ToeicTestSchemaClass } from '../entities/toeic-test.schema';

export class ToeicTestMapper {
  public static toDomain(raw: ToeicTestSchemaClass): ToeicTest {
    const domainEntity = new ToeicTest();
    domainEntity.deletedAt = raw.deletedAt;

    domainEntity.status = raw.status;

    domainEntity.category = raw.category;

    domainEntity.description = raw.description;

    domainEntity.title = raw.title;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: ToeicTest): ToeicTestSchemaClass {
    const persistenceSchema = new ToeicTestSchemaClass();
    persistenceSchema.deletedAt = domainEntity.deletedAt;

    persistenceSchema.status = domainEntity.status;

    persistenceSchema.category = domainEntity.category;

    persistenceSchema.description = domainEntity.description;

    persistenceSchema.title = domainEntity.title;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
