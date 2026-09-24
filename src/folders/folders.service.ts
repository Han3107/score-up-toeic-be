import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderRepository } from './infrastructure/persistence/folder.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Folder } from './domain/folder';
import { VocabularyModulesService } from '../vocabulary-modules/vocabulary-modules.service';

@Injectable()
export class FoldersService {
  constructor(
    private readonly folderRepository: FolderRepository,
    @Inject(forwardRef(() => VocabularyModulesService))
    private readonly vocabularyModulesService: VocabularyModulesService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.folderRepository.hardDeleteExpired(15);
  }

  async create(createFolderDto: CreateFolderDto, userId: string) {
    return this.folderRepository.create({
      deletedAt: null,
      userId,
      description: createFolderDto.description,
      title: createFolderDto.title,
    });
  }

  findAllWithPagination({
    paginationOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
  }) {
    return this.folderRepository.findAllWithPagination({
      paginationOptions,
      userId,
    });
  }

  async findById(id: Folder['id'], userId: string, includeModules = false) {
    const folder = await this.folderRepository.findById(id, userId);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (includeModules) {
      const modules = await this.vocabularyModulesService.findByFolderId(
        id,
        userId,
      );
      (folder as any).modules = modules; // Attach dynamically or add to domain
    }

    return folder;
  }

  findByIds(ids: Folder['id'][], userId: string) {
    return this.folderRepository.findByIds(ids, userId);
  }

  async update(
    id: Folder['id'],
    updateFolderDto: UpdateFolderDto,
    userId: string,
  ) {
    return this.folderRepository.update(id, userId, {
      description: updateFolderDto.description,
      title: updateFolderDto.title,
    });
  }

  async remove(id: Folder['id'], userId: string) {
    await this.vocabularyModulesService.removeByFolderId(id, userId);
    return this.folderRepository.remove(id, userId);
  }

  restore(id: Folder['id'], userId: string) {
    return this.folderRepository.restore(id, userId);
  }
}
