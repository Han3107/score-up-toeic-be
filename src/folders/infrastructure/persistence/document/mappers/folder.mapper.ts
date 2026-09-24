import { Folder } from '../../../../domain/folder';

import { FolderSchemaClass } from '../entities/folder.schema';

export class FolderMapper {
  public static toDomain(raw: FolderSchemaClass): Folder {
    const domainEntity = new Folder();
    domainEntity.deletedAt = raw.deletedAt;

    domainEntity.userId = raw.userId;

    domainEntity.description = raw.description;

    domainEntity.title = raw.title;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Folder): FolderSchemaClass {
    const persistenceSchema = new FolderSchemaClass();
    persistenceSchema.deletedAt = domainEntity.deletedAt;

    persistenceSchema.userId = domainEntity.userId;

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
