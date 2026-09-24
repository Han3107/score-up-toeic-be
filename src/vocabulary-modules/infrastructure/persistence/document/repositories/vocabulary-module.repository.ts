import { Injectable, NotFoundException } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VocabularyModuleSchemaClass } from '../entities/vocabulary-module.schema';
import { VocabularyModuleRepository } from '../../vocabulary-module.repository';
import { VocabularyModule } from '../../../../domain/vocabulary-module';
import { VocabularyModuleMapper } from '../mappers/vocabulary-module.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class VocabularyModuleDocumentRepository implements VocabularyModuleRepository {
  constructor(
    @InjectModel(VocabularyModuleSchemaClass.name)
    private readonly vocabularyModuleModel: Model<VocabularyModuleSchemaClass>,
  ) {}

  async create(data: VocabularyModule): Promise<VocabularyModule> {
    const persistenceModel = VocabularyModuleMapper.toPersistence(data);
    const createdEntity = new this.vocabularyModuleModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return VocabularyModuleMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<VocabularyModule[]> {
    const entityObjects = await this.vocabularyModuleModel
      .find({ userId, deletedAt: null })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      VocabularyModuleMapper.toDomain(entityObject),
    );
  }

  async findById(
    id: VocabularyModule['id'],
    userId: string,
  ): Promise<NullableType<VocabularyModule>> {
    const entityObject = await this.vocabularyModuleModel.findOne({
      _id: id,
      userId,
      deletedAt: null,
    });
    return entityObject ? VocabularyModuleMapper.toDomain(entityObject) : null;
  }

  async findByIds(
    ids: VocabularyModule['id'][],
    userId: string,
  ): Promise<VocabularyModule[]> {
    const entityObjects = await this.vocabularyModuleModel.find({
      _id: { $in: ids },
      userId,
      deletedAt: null,
    });
    return entityObjects.map((entityObject) =>
      VocabularyModuleMapper.toDomain(entityObject),
    );
  }

  async findByFolderId(
    folderId: string,
    userId: string,
  ): Promise<VocabularyModule[]> {
    const entityObjects = await this.vocabularyModuleModel.find({
      folderId,
      userId,
      deletedAt: null,
    });
    return entityObjects.map((entityObject) =>
      VocabularyModuleMapper.toDomain(entityObject),
    );
  }

  async update(
    id: VocabularyModule['id'],
    userId: string,
    payload: Partial<VocabularyModule>,
  ): Promise<NullableType<VocabularyModule>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString(), userId, deletedAt: null };
    const entity = await this.vocabularyModuleModel.findOne(filter);

    if (!entity) {
      throw new NotFoundException('VocabularyModule not found');
    }

    const entityObject = await this.vocabularyModuleModel.findOneAndUpdate(
      filter,
      VocabularyModuleMapper.toPersistence({
        ...VocabularyModuleMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? VocabularyModuleMapper.toDomain(entityObject) : null;
  }

  async remove(id: VocabularyModule['id'], userId: string): Promise<void> {
    await this.vocabularyModuleModel.updateOne(
      { _id: id, userId },
      { deletedAt: new Date() },
    );
  }

  async removeByFolderId(folderId: string, userId: string): Promise<void> {
    await this.vocabularyModuleModel.updateMany(
      { folderId, userId },
      { deletedAt: new Date() },
    );
  }

  async restore(
    id: VocabularyModule['id'],
    userId: string,
  ): Promise<NullableType<VocabularyModule>> {
    const filter = { _id: id.toString(), userId, deletedAt: { $ne: null } };
    const entity = await this.vocabularyModuleModel.findOne(filter);

    if (!entity) {
      throw new NotFoundException('Soft-deleted VocabularyModule not found');
    }

    const entityObject = await this.vocabularyModuleModel.findOneAndUpdate(
      filter,
      { $set: { deletedAt: null } },
      { new: true },
    );

    return entityObject ? VocabularyModuleMapper.toDomain(entityObject) : null;
  }

  async hardDeleteExpired(days: number): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - days);

    await this.vocabularyModuleModel.deleteMany({
      deletedAt: { $ne: null, $lt: expirationDate },
    });
  }
}
