import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversationSchemaClass } from '../entities/conversation.schema';
import { ConversationRepository } from '../../conversation.repository';
import { Conversation } from '../../../../domain/conversation';
import { ConversationMapper } from '../mappers/conversation.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ConversationDocumentRepository implements ConversationRepository {
  constructor(
    @InjectModel(ConversationSchemaClass.name)
    private readonly conversationModel: Model<ConversationSchemaClass>,
  ) {}

  async create(data: Conversation): Promise<Conversation> {
    const persistenceModel = ConversationMapper.toPersistence(data);
    const createdEntity = new this.conversationModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return ConversationMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Conversation[]> {
    const entityObjects = await this.conversationModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ConversationMapper.toDomain(entityObject),
    );
  }

  async findByParticipantWithPagination(
    userId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<Conversation[]> {
    const entityObjects = await this.conversationModel
      .find({ participants: userId } as any)
      .sort({ updatedAt: -1 })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ConversationMapper.toDomain(entityObject),
    );
  }

  async findByParticipants(
    user1Id: string,
    user2Id: string,
  ): Promise<NullableType<Conversation>> {
    const entityObject = await this.conversationModel.findOne({
      participants: { $all: [user1Id, user2Id] } as any,
    });
    return entityObject ? ConversationMapper.toDomain(entityObject) : null;
  }

  async findById(id: Conversation['id']): Promise<NullableType<Conversation>> {
    const entityObject = await this.conversationModel.findById(id);
    return entityObject ? ConversationMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Conversation['id'][]): Promise<Conversation[]> {
    const entityObjects = await this.conversationModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      ConversationMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Conversation['id'],
    payload: Partial<Conversation>,
  ): Promise<NullableType<Conversation>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.conversationModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.conversationModel.findOneAndUpdate(
      filter,
      ConversationMapper.toPersistence({
        ...ConversationMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? ConversationMapper.toDomain(entityObject) : null;
  }

  async remove(id: Conversation['id']): Promise<void> {
    await this.conversationModel.deleteOne({ _id: id });
  }
}
