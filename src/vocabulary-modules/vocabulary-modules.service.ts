import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateVocabularyModuleDto } from './dto/create-vocabulary-module.dto';
import { UpdateVocabularyModuleDto } from './dto/update-vocabulary-module.dto';
import { VocabularyModuleRepository } from './infrastructure/persistence/vocabulary-module.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { VocabularyModule, VocabularyTerm } from './domain/vocabulary-module';
import { FoldersService } from '../folders/folders.service';

@Injectable()
export class VocabularyModulesService {
  constructor(
    private readonly vocabularyModuleRepository: VocabularyModuleRepository,
    @Inject(forwardRef(() => FoldersService))
    private readonly foldersService: FoldersService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.vocabularyModuleRepository.hardDeleteExpired(15);
  }

  async validateFolderOwnership(
    folderId: string | undefined | null,
    userId: string,
  ) {
    if (folderId) {
      await this.foldersService.findById(folderId, userId);
    }
  }

  async create(
    createVocabularyModuleDto: CreateVocabularyModuleDto,
    userId: string,
  ) {
    await this.validateFolderOwnership(
      createVocabularyModuleDto.folderId,
      userId,
    );

    return this.vocabularyModuleRepository.create({
      deletedAt: null,
      folderId: createVocabularyModuleDto.folderId,
      userId,
      description: createVocabularyModuleDto.description,
      title: createVocabularyModuleDto.title,
      terms: createVocabularyModuleDto.terms || [],
    } as Omit<VocabularyModule, 'id' | 'createdAt' | 'updatedAt'>);
  }

  findAllWithPagination({
    paginationOptions,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
  }) {
    return this.vocabularyModuleRepository.findAllWithPagination({
      paginationOptions,
      userId,
    });
  }

  async findById(id: VocabularyModule['id'], userId: string, random = false) {
    const module = await this.vocabularyModuleRepository.findById(id, userId);
    if (!module) {
      throw new NotFoundException('VocabularyModule not found');
    }

    if (random && module.terms && module.terms.length > 0) {
      // Fisher-Yates shuffle
      const terms = [...module.terms];
      for (let i = terms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [terms[i], terms[j]] = [terms[j], terms[i]];
      }
      module.terms = terms;
    }

    return module;
  }

  findByIds(ids: VocabularyModule['id'][], userId: string) {
    return this.vocabularyModuleRepository.findByIds(ids, userId);
  }

  findByFolderId(folderId: string, userId: string) {
    return this.vocabularyModuleRepository.findByFolderId(folderId, userId);
  }

  async update(
    id: VocabularyModule['id'],
    updateVocabularyModuleDto: UpdateVocabularyModuleDto,
    userId: string,
  ) {
    if (updateVocabularyModuleDto.folderId !== undefined) {
      await this.validateFolderOwnership(
        updateVocabularyModuleDto.folderId,
        userId,
      );
    }

    return this.vocabularyModuleRepository.update(id, userId, {
      folderId: updateVocabularyModuleDto.folderId,
      description: updateVocabularyModuleDto.description,
      title: updateVocabularyModuleDto.title,
      terms: updateVocabularyModuleDto.terms,
    } as Partial<VocabularyModule>);
  }

  remove(id: VocabularyModule['id'], userId: string) {
    return this.vocabularyModuleRepository.remove(id, userId);
  }

  removeByFolderId(folderId: string, userId: string) {
    return this.vocabularyModuleRepository.removeByFolderId(folderId, userId);
  }

  restore(id: VocabularyModule['id'], userId: string) {
    return this.vocabularyModuleRepository.restore(id, userId);
  }

  async clone(
    id: VocabularyModule['id'],
    userId: string,
    targetFolderId?: string,
  ) {
    const sourceModule = await this.findById(id, userId);
    if (targetFolderId) {
      await this.validateFolderOwnership(targetFolderId, userId);
    }

    const terms = (sourceModule.terms || []).map((t) => ({
      term: t.term,
      definition: t.definition,
    }));

    return this.vocabularyModuleRepository.create({
      deletedAt: null,
      folderId: targetFolderId || sourceModule.folderId,
      userId,
      description: sourceModule.description,
      title: `${sourceModule.title} (Clone)`,
      terms: terms as VocabularyTerm[],
    } as Omit<VocabularyModule, 'id' | 'createdAt' | 'updatedAt'>);
  }
}
