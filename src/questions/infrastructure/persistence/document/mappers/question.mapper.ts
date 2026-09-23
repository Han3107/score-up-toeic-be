import { Question } from '../../../../domain/question';

import { QuestionGroupMapper } from '../../../../../question-groups/infrastructure/persistence/document/mappers/question-group.mapper';

import { ToeicTestMapper } from '../../../../../toeic-tests/infrastructure/persistence/document/mappers/toeic-test.mapper';

import { QuestionSchemaClass } from '../entities/question.schema';

export class QuestionMapper {
  public static toDomain(raw: QuestionSchemaClass): Question {
    const domainEntity = new Question();
    domainEntity.orderIndex = raw.orderIndex;

    domainEntity.explanation = raw.explanation;

    domainEntity.correctAnswer = raw.correctAnswer;

    domainEntity.options = raw.options;

    domainEntity.prompt = raw.prompt;

    if (raw.questionGroup) {
      domainEntity.questionGroup = QuestionGroupMapper.toDomain(
        raw.questionGroup,
      );
    } else if (raw.questionGroup === null) {
      domainEntity.questionGroup = null;
    }

    if (raw.toeicTest) {
      domainEntity.toeicTest = ToeicTestMapper.toDomain(raw.toeicTest);
    }

    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Question): QuestionSchemaClass {
    const persistenceSchema = new QuestionSchemaClass();
    persistenceSchema.orderIndex = domainEntity.orderIndex;

    persistenceSchema.explanation = domainEntity.explanation;

    persistenceSchema.correctAnswer = domainEntity.correctAnswer;

    persistenceSchema.options = domainEntity.options;

    persistenceSchema.prompt = domainEntity.prompt;

    if (domainEntity.questionGroup) {
      persistenceSchema.questionGroup = QuestionGroupMapper.toPersistence(
        domainEntity.questionGroup,
      );
    } else if (domainEntity.questionGroup === null) {
      persistenceSchema.questionGroup = null;
    }

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
