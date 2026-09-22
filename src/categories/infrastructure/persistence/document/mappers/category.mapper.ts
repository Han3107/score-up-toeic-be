import { Category } from '../../../../domain/category';

import { CategorySchemaClass } from '../entities/category.schema';

export class CategoryMapper {
  public static toDomain(raw: CategorySchemaClass): Category {
    const domainEntity = new Category();
    domainEntity.sequence = raw.sequence;

    domainEntity.status = raw.status;

    domainEntity.description = raw.description;

    domainEntity.name = raw.name;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Category): CategorySchemaClass {
    const persistenceSchema = new CategorySchemaClass();
    persistenceSchema.sequence = domainEntity.sequence;

    persistenceSchema.status = domainEntity.status;

    persistenceSchema.description = domainEntity.description;

    persistenceSchema.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
