import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { ToeicTest } from '../../domain/toeic-test';

export abstract class ToeicTestRepository {
  abstract create(
    data: Omit<ToeicTest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ToeicTest>;

  abstract findAllWithPagination({
    paginationOptions,
    status,
  }: {
    paginationOptions: IPaginationOptions;
    status?: string;
  }): Promise<ToeicTest[]>;

  abstract findById(id: ToeicTest['id']): Promise<NullableType<ToeicTest>>;

  abstract findByIds(ids: ToeicTest['id'][]): Promise<ToeicTest[]>;

  abstract update(
    id: ToeicTest['id'],
    payload: DeepPartial<ToeicTest>,
  ): Promise<ToeicTest | null>;

  abstract remove(id: ToeicTest['id']): Promise<void>;
}
