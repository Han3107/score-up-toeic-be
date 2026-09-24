import { Injectable, NotFoundException } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FolderSchemaClass } from '../entities/folder.schema';
import { FolderRepository } from '../../folder.repository';
import { Folder } from '../../../../domain/folder';
import { FolderMapper } from '../mappers/folder.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class FolderDocumentRepository implements FolderRepository {
  constructor(
    @InjectModel(FolderSchemaClass.name)
    private readonly folderModel: Model<FolderSchemaClass>,
  ) {}

  async create(data: Folder): Promise<Folder> {
    const persistenceModel = FolderMapper.toPersistence(data);
    const createdEntity = new this.folderModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return FolderMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
  }): Promise<Folder[]> {
    const entityObjects = await this.folderModel
      .find({ userId, deletedAt: null })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      FolderMapper.toDomain(entityObject),
    );
  }

  async findById(
    id: Folder['id'],
    userId: string,
  ): Promise<NullableType<Folder>> {
    const entityObject = await this.folderModel.findOne({
      _id: id,
      userId,
      deletedAt: null,
    });
    return entityObject ? FolderMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Folder['id'][], userId: string): Promise<Folder[]> {
    const entityObjects = await this.folderModel.find({
      _id: { $in: ids },
      userId,
      deletedAt: null,
    });
    return entityObjects.map((entityObject) =>
      FolderMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Folder['id'],
    userId: string,
    payload: Partial<Folder>,
  ): Promise<NullableType<Folder>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString(), userId, deletedAt: null };
    const entity = await this.folderModel.findOne(filter);

    if (!entity) {
      throw new NotFoundException('Folder not found');
    }

    const entityObject = await this.folderModel.findOneAndUpdate(
      filter,
      FolderMapper.toPersistence({
        ...FolderMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? FolderMapper.toDomain(entityObject) : null;
  }

  async remove(id: Folder['id'], userId: string): Promise<void> {
    await this.folderModel.updateOne(
      { _id: id, userId },
      { deletedAt: new Date() },
    );
  }

  async restore(
    id: Folder['id'],
    userId: string,
  ): Promise<NullableType<Folder>> {
    const filter = { _id: id.toString(), userId, deletedAt: { $ne: null } };
    const entity = await this.folderModel.findOne(filter);

    if (!entity) {
      throw new NotFoundException('Soft-deleted folder not found');
    }

    const entityObject = await this.folderModel.findOneAndUpdate(
      filter,
      { $set: { deletedAt: null } },
      { new: true },
    );

    return entityObject ? FolderMapper.toDomain(entityObject) : null;
  }

  async hardDeleteExpired(days: number): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - days);

    await this.folderModel.deleteMany({
      deletedAt: { $ne: null, $lt: expirationDate },
    });
  }
}
