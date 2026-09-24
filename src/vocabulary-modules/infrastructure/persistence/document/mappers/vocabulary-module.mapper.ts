import { VocabularyModule } from '../../../../domain/vocabulary-module';

import { VocabularyModuleSchemaClass } from '../entities/vocabulary-module.schema';

export class VocabularyModuleMapper {
  public static toDomain(raw: VocabularyModuleSchemaClass): VocabularyModule {
    const domainEntity = new VocabularyModule();
    domainEntity.deletedAt = raw.deletedAt;

    domainEntity.folderId = raw.folderId;

    domainEntity.userId = raw.userId;

    domainEntity.description = raw.description;

    domainEntity.title = raw.title;

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    domainEntity.terms = (raw.terms || []).map((term: any) => {
      return {
        id: term._id.toString(),
        term: term.term,
        definition: term.definition,
        createdAt: term.createdAt,
        updatedAt: term.updatedAt,
      };
    });

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: VocabularyModule,
  ): VocabularyModuleSchemaClass {
    const persistenceSchema = new VocabularyModuleSchemaClass();
    persistenceSchema.deletedAt = domainEntity.deletedAt;

    persistenceSchema.folderId = domainEntity.folderId;

    persistenceSchema.userId = domainEntity.userId;

    persistenceSchema.description = domainEntity.description;

    persistenceSchema.title = domainEntity.title;

    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    persistenceSchema.terms = (domainEntity.terms || []).map((term: any) => {
      const termSchema = {
        term: term.term,
        definition: term.definition,
      } as any;
      if (term.id) {
        termSchema._id = term.id;
      }
      return termSchema;
    });

    return persistenceSchema;
  }
}
