import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Conversation } from '../../domain/conversation';

export abstract class ConversationRepository {
  abstract create(
    data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Conversation>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Conversation[]>;

  abstract findByParticipantWithPagination(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Conversation[]>;

  abstract findByParticipants(
    user1Id: string,
    user2Id: string,
  ): Promise<NullableType<Conversation>>;

  abstract findById(
    id: Conversation['id'],
  ): Promise<NullableType<Conversation>>;

  abstract findByIds(ids: Conversation['id'][]): Promise<Conversation[]>;

  abstract update(
    id: Conversation['id'],
    payload: DeepPartial<Conversation>,
  ): Promise<Conversation | null>;

  abstract remove(id: Conversation['id']): Promise<void>;
}
