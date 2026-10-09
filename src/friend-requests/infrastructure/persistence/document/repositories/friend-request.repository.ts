import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequestSchemaClass } from '../entities/friend-request.schema';
import { FriendRequestRepository } from '../../friend-request.repository';
import { FriendRequest } from '../../../../domain/friend-request';
import { FriendRequestMapper } from '../mappers/friend-request.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class FriendRequestDocumentRepository implements FriendRequestRepository {
  constructor(
    @InjectModel(FriendRequestSchemaClass.name)
    private readonly friendRequestModel: Model<FriendRequestSchemaClass>,
  ) {}

  async create(data: FriendRequest): Promise<FriendRequest> {
    const persistenceModel = FriendRequestMapper.toPersistence(data);
    const createdEntity = new this.friendRequestModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return FriendRequestMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FriendRequest[]> {
    const entityObjects = await this.friendRequestModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      FriendRequestMapper.toDomain(entityObject),
    );
  }

  async findById(
    id: FriendRequest['id'],
  ): Promise<NullableType<FriendRequest>> {
    const entityObject = await this.friendRequestModel.findById(id);
    return entityObject ? FriendRequestMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: FriendRequest['id'][]): Promise<FriendRequest[]> {
    const entityObjects = await this.friendRequestModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      FriendRequestMapper.toDomain(entityObject),
    );
  }

  async update(
    id: FriendRequest['id'],
    payload: Partial<FriendRequest>,
  ): Promise<NullableType<FriendRequest>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.friendRequestModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.friendRequestModel.findOneAndUpdate(
      filter,
      FriendRequestMapper.toPersistence({
        ...FriendRequestMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? FriendRequestMapper.toDomain(entityObject) : null;
  }

  async remove(id: FriendRequest['id']): Promise<void> {
    await this.friendRequestModel.deleteOne({ _id: id });
  }

  async areFriends(user1Id: string, user2Id: string): Promise<boolean> {
    const request = await this.friendRequestModel.findOne({
      $or: [
        { sender: user1Id, receiver: user2Id, status: 'accepted' },
        { sender: user2Id, receiver: user1Id, status: 'accepted' },
      ],
    } as any);
    return !!request;
  }
}
