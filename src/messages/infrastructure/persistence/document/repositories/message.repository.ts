import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageSchemaClass } from '../entities/message.schema';
import { MessageRepository } from '../../message.repository';
import { Message } from '../../../../domain/message';
import { MessageMapper } from '../mappers/message.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MessageDocumentRepository implements MessageRepository {
  constructor(
    @InjectModel(MessageSchemaClass.name)
    private readonly messageModel: Model<MessageSchemaClass>,
  ) {}

  async create(data: Message): Promise<Message> {
    const persistenceModel = MessageMapper.toPersistence(data);
    const createdEntity = new this.messageModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return MessageMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Message[]> {
    const entityObjects = await this.messageModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      MessageMapper.toDomain(entityObject),
    );
  }

  async findById(id: Message['id']): Promise<NullableType<Message>> {
    const entityObject = await this.messageModel.findById(id);
    return entityObject ? MessageMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Message['id'][]): Promise<Message[]> {
    const entityObjects = await this.messageModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      MessageMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Message['id'],
    payload: Partial<Message>,
  ): Promise<NullableType<Message>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.messageModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.messageModel.findOneAndUpdate(
      filter,
      MessageMapper.toPersistence({
        ...MessageMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? MessageMapper.toDomain(entityObject) : null;
  }

  async remove(id: Message['id']): Promise<void> {
    await this.messageModel.deleteOne({ _id: id });
  }
}
