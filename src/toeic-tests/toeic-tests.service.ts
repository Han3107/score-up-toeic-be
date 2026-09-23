import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateToeicTestDto } from './dto/create-toeic-test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic-test.dto';
import { ToeicTestRepository } from './infrastructure/persistence/toeic-test.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ToeicTest } from './domain/toeic-test';

@Injectable()
export class ToeicTestsService {
  constructor(
    // Dependencies here
    private readonly toeicTestRepository: ToeicTestRepository,
  ) {}

  async create(createToeicTestDto: CreateToeicTestDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.toeicTestRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      deletedAt: createToeicTestDto.deletedAt,

      status: createToeicTestDto.status ?? 'DRAFT',

      category: createToeicTestDto.category,

      description: createToeicTestDto.description,

      title: createToeicTestDto.title,
    });
  }

  findAllWithPagination({
    paginationOptions,
    status,
  }: {
    paginationOptions: IPaginationOptions;
    status?: string;
  }) {
    return this.toeicTestRepository.findAllWithPagination({
      status,
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: ToeicTest['id']) {
    return this.toeicTestRepository.findById(id);
  }

  findByIds(ids: ToeicTest['id'][]) {
    return this.toeicTestRepository.findByIds(ids);
  }

  async update(
    id: ToeicTest['id'],

    updateToeicTestDto: UpdateToeicTestDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.toeicTestRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      deletedAt: updateToeicTestDto.deletedAt,

      status: updateToeicTestDto.status,

      category: updateToeicTestDto.category,

      description: updateToeicTestDto.description,

      title: updateToeicTestDto.title,
    });
  }

  async remove(id: ToeicTest['id']) {
    return this.toeicTestRepository.update(id, {
      deletedAt: new Date(),
    });
  }
}
