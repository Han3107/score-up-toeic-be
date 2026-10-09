import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { FriendRequest } from '../../domain/friend-request';

export abstract class FriendRequestRepository {
  abstract create(
    data: Omit<FriendRequest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<FriendRequest>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FriendRequest[]>;

  abstract findById(
    id: FriendRequest['id'],
  ): Promise<NullableType<FriendRequest>>;

  abstract findByIds(ids: FriendRequest['id'][]): Promise<FriendRequest[]>;

  abstract update(
    id: FriendRequest['id'],
    payload: DeepPartial<FriendRequest>,
  ): Promise<FriendRequest | null>;

  abstract remove(id: FriendRequest['id']): Promise<void>;

  abstract findPendingRequests(userId: string): Promise<FriendRequest[]>;
  abstract findFriends(userId: string): Promise<FriendRequest[]>;
  abstract areFriends(user1Id: string, user2Id: string): Promise<boolean>;
}
