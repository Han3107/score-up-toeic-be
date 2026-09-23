import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToeicTestSchemaClass } from '../entities/toeic-test.schema';
import { ToeicTestRepository } from '../../toeic-test.repository';
import { ToeicTest } from '../../../../domain/toeic-test';
import { ToeicTestMapper } from '../mappers/toeic-test.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ToeicTestDocumentRepository implements ToeicTestRepository {
  constructor(
    @InjectModel(ToeicTestSchemaClass.name)
    private readonly toeicTestModel: Model<ToeicTestSchemaClass>,
  ) {}

  async create(data: ToeicTest): Promise<ToeicTest> {
    const persistenceModel = ToeicTestMapper.toPersistence(data);
    const createdEntity = new this.toeicTestModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return ToeicTestMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
    status,
  }: {
    paginationOptions: IPaginationOptions;
    status?: string;
  }): Promise<ToeicTest[]> {
    const query: any = { deletedAt: { $eq: null } };
    if (status) query.status = status;

    const entityObjects = await this.toeicTestModel
      .find(query)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      ToeicTestMapper.toDomain(entityObject),
    );
  }

  async findById(id: ToeicTest['id']): Promise<NullableType<ToeicTest>> {
    const entityObject = await this.toeicTestModel.findOne({
      _id: id,
      deletedAt: { $eq: null },
    });
    return entityObject ? ToeicTestMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: ToeicTest['id'][]): Promise<ToeicTest[]> {
    const entityObjects = await this.toeicTestModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      ToeicTestMapper.toDomain(entityObject),
    );
  }

  async update(
    id: ToeicTest['id'],
    payload: Partial<ToeicTest>,
  ): Promise<NullableType<ToeicTest>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.toeicTestModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.toeicTestModel.findOneAndUpdate(
      filter,
      ToeicTestMapper.toPersistence({
        ...ToeicTestMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? ToeicTestMapper.toDomain(entityObject) : null;
  }

  async remove(id: ToeicTest['id']): Promise<void> {
    await this.toeicTestModel.deleteOne({ _id: id });
  }
}
