import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { VocabularyModule } from '../../domain/vocabulary-module';

export abstract class VocabularyModuleRepository {
  abstract create(
    data: Omit<VocabularyModule, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<VocabularyModule>;

  abstract findAllWithPagination({
    paginationOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<VocabularyModule[]>;

  abstract findById(
    id: VocabularyModule['id'],
    userId: string,
  ): Promise<NullableType<VocabularyModule>>;

  abstract findByIds(
    ids: VocabularyModule['id'][],
    userId: string,
  ): Promise<VocabularyModule[]>;

  abstract findByFolderId(
    folderId: string,
    userId: string,
  ): Promise<VocabularyModule[]>;

  abstract update(
    id: VocabularyModule['id'],
    userId: string,
    payload: DeepPartial<VocabularyModule>,
  ): Promise<VocabularyModule | null>;

  abstract remove(id: VocabularyModule['id'], userId: string): Promise<void>;

  abstract removeByFolderId(folderId: string, userId: string): Promise<void>;

  abstract restore(
    id: VocabularyModule['id'],
    userId: string,
  ): Promise<VocabularyModule | null>;

  abstract hardDeleteExpired(days: number): Promise<void>;
}
