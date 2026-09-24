import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Folder } from '../../domain/folder';

export abstract class FolderRepository {
  abstract create(
    data: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Folder>;

  abstract findAllWithPagination({
    paginationOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<Folder[]>;

  abstract findById(
    id: Folder['id'],
    userId: string,
  ): Promise<NullableType<Folder>>;

  abstract findByIds(ids: Folder['id'][], userId: string): Promise<Folder[]>;

  abstract update(
    id: Folder['id'],
    userId: string,
    payload: DeepPartial<Folder>,
  ): Promise<Folder | null>;

  abstract remove(id: Folder['id'], userId: string): Promise<void>;

  abstract restore(id: Folder['id'], userId: string): Promise<Folder | null>;

  abstract hardDeleteExpired(days: number): Promise<void>;
}
