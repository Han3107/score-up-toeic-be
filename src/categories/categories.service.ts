import {
  Injectable,
  Inject,
  Optional,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './infrastructure/persistence/category.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Category } from './domain/category';
import {
  EXAMS_DEPENDENCY_PROVIDER,
  IExamsDependencyProvider,
} from './exams-dependency.provider';
import { SyncCategoriesDto } from './dto/sync-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Optional()
    @Inject(EXAMS_DEPENDENCY_PROVIDER)
    private readonly examsDependencyProvider: IExamsDependencyProvider,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let sequence = createCategoryDto.sequence;

    // Auto-generate Max + 1 if sequence is omitted
    if (sequence === undefined || sequence === null) {
      const maxSequence = await this.categoryRepository.findMaxSequence();
      sequence = maxSequence + 1;
    }

    // Check if name already exists
    const existing = await this.categoryRepository.findByName(
      createCategoryDto.name,
    );
    if (existing) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    return this.categoryRepository.create({
      sequence,
      status: createCategoryDto.status || 'ACTIVE',
      description: createCategoryDto.description,
      name: createCategoryDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
    status,
  }: {
    paginationOptions: IPaginationOptions;
    status?: string;
  }) {
    return this.categoryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      status,
    });
  }

  findById(id: Category['id']) {
    return this.categoryRepository.findById(id);
  }

  findByIds(ids: Category['id'][]) {
    return this.categoryRepository.findByIds(ids);
  }

  async update(id: Category['id'], updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name) {
      const existing = await this.categoryRepository.findByName(
        updateCategoryDto.name,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }

    return this.categoryRepository.update(id, {
      sequence: updateCategoryDto.sequence,
      status: updateCategoryDto.status,
      description: updateCategoryDto.description,
      name: updateCategoryDto.name,
    });
  }

  async remove(id: Category['id']) {
    if (this.examsDependencyProvider) {
      const hasExams = await this.examsDependencyProvider.hasLinkedExams(
        id as string,
      );
      if (hasExams) {
        throw new ConflictException(
          'Cannot delete category because it contains linked exams.',
        );
      }
    }

    return this.categoryRepository.remove(id);
  }

  async syncDefaults(syncDto: SyncCategoriesDto) {
    const incomingNames = syncDto.categories.map((c) => c.name);

    // Find which ones already exist
    const existingCategories =
      await this.categoryRepository.findByNames(incomingNames);
    const existingNames = new Set(existingCategories.map((c) => c.name));

    // Filter out duplicates
    const categoriesToCreate = syncDto.categories.filter(
      (c) => !existingNames.has(c.name),
    );

    let createdCount = 0;

    for (const cat of categoriesToCreate) {
      const maxSequence = await this.categoryRepository.findMaxSequence();
      await this.categoryRepository.create({
        name: cat.name,
        description: cat.description,
        status: 'ACTIVE',
        sequence: maxSequence + 1,
      });
      createdCount++;
    }

    return {
      message: 'Sync completed successfully',
      createdCount,
      skippedCount: incomingNames.length - createdCount,
    };
  }
}
