import { QuestionGroup } from '../../../../domain/question-group';

import { ToeicTestMapper } from '../../../../../toeic-tests/infrastructure/persistence/document/mappers/toeic-test.mapper';

import { QuestionGroupSchemaClass } from '../entities/question-group.schema';

export class QuestionGroupMapper {
  public static toDomain(raw: QuestionGroupSchemaClass): QuestionGroup {
    const domainEntity = new QuestionGroup();
    domainEntity.orderIndex = raw.orderIndex;

    domainEntity.imageUrl = raw.imageUrl;

    domainEntity.audioUrl = raw.audioUrl;

    domainEntity.passageText = raw.passageText;

    domainEntity.title = raw.title;

    if (raw.toeicTest) {
      domainEntity.toeicTest = ToeicTestMapper.toDomain(raw.toeicTest);
    }

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: QuestionGroup,
  ): QuestionGroupSchemaClass {
    const persistenceSchema = new QuestionGroupSchemaClass();
    persistenceSchema.orderIndex = domainEntity.orderIndex;

    persistenceSchema.imageUrl = domainEntity.imageUrl;

    persistenceSchema.audioUrl = domainEntity.audioUrl;

    persistenceSchema.passageText = domainEntity.passageText;

    persistenceSchema.title = domainEntity.title;

    if (domainEntity.toeicTest) {
      persistenceSchema.toeicTest = ToeicTestMapper.toPersistence(
        domainEntity.toeicTest,
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
