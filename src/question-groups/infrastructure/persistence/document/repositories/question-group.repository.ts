import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionGroupSchemaClass } from '../entities/question-group.schema';
import { QuestionGroupRepository } from '../../question-group.repository';
import { QuestionGroup } from '../../../../domain/question-group';
import { QuestionGroupMapper } from '../mappers/question-group.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class QuestionGroupDocumentRepository implements QuestionGroupRepository {
  constructor(
    @InjectModel(QuestionGroupSchemaClass.name)
    private readonly questionGroupModel: Model<QuestionGroupSchemaClass>,
  ) {}

  async create(data: QuestionGroup): Promise<QuestionGroup> {
    const persistenceModel = QuestionGroupMapper.toPersistence(data);
    const createdEntity = new this.questionGroupModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return QuestionGroupMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<QuestionGroup[]> {
    const entityObjects = await this.questionGroupModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      QuestionGroupMapper.toDomain(entityObject),
    );
  }

  async findByExamId(examId: string): Promise<QuestionGroup[]> {
    const entityObjects = await this.questionGroupModel.find({
      toeicTest: examId,
    } as any);
    return entityObjects.map((entityObject) =>
      QuestionGroupMapper.toDomain(entityObject),
    );
  }

  async findById(
    id: QuestionGroup['id'],
  ): Promise<NullableType<QuestionGroup>> {
    const entityObject = await this.questionGroupModel.findById(id);
    return entityObject ? QuestionGroupMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: QuestionGroup['id'][]): Promise<QuestionGroup[]> {
    const entityObjects = await this.questionGroupModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      QuestionGroupMapper.toDomain(entityObject),
    );
  }

  async update(
    id: QuestionGroup['id'],
    payload: Partial<QuestionGroup>,
  ): Promise<NullableType<QuestionGroup>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.questionGroupModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.questionGroupModel.findOneAndUpdate(
      filter,
      QuestionGroupMapper.toPersistence({
        ...QuestionGroupMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? QuestionGroupMapper.toDomain(entityObject) : null;
  }

  async remove(id: QuestionGroup['id']): Promise<void> {
    await this.questionGroupModel.deleteOne({ _id: id });
  }
}
