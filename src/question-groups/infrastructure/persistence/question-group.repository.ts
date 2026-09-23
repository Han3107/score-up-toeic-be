import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { QuestionGroup } from '../../domain/question-group';

export abstract class QuestionGroupRepository {
  abstract create(
    data: Omit<QuestionGroup, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<QuestionGroup>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<QuestionGroup[]>;

  abstract findByExamId(examId: string): Promise<QuestionGroup[]>;

  abstract findById(
    id: QuestionGroup['id'],
  ): Promise<NullableType<QuestionGroup>>;

  abstract findByIds(ids: QuestionGroup['id'][]): Promise<QuestionGroup[]>;

  abstract update(
    id: QuestionGroup['id'],
    payload: DeepPartial<QuestionGroup>,
  ): Promise<QuestionGroup | null>;

  abstract remove(id: QuestionGroup['id']): Promise<void>;
}
