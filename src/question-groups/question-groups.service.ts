import { ToeicTestsService } from '../toeic-tests/toeic-tests.service';
import { ToeicTest } from '../toeic-tests/domain/toeic-test';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateQuestionGroupDto } from './dto/create-question-group.dto';
import { UpdateQuestionGroupDto } from './dto/update-question-group.dto';
import { QuestionGroupRepository } from './infrastructure/persistence/question-group.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { QuestionGroup } from './domain/question-group';

@Injectable()
export class QuestionGroupsService {
  constructor(
    @Inject(forwardRef(() => ToeicTestsService))
    private readonly toeicTestService: ToeicTestsService,

    // Dependencies here
    private readonly questionGroupRepository: QuestionGroupRepository,
  ) {}

  async create(createQuestionGroupDto: CreateQuestionGroupDto) {
    // Do not remove comment below.
    // <creating-property />

    const toeicTestObject = await this.toeicTestService.findById(
      createQuestionGroupDto.toeicTest.id,
    );
    if (!toeicTestObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          toeicTest: 'notExists',
        },
      });
    }
    const toeicTest = toeicTestObject;

    return this.questionGroupRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      orderIndex: createQuestionGroupDto.orderIndex,

      imageUrl: createQuestionGroupDto.imageUrl,

      audioUrl: createQuestionGroupDto.audioUrl,

      passageText: createQuestionGroupDto.passageText,

      title: createQuestionGroupDto.title,

      toeicTest,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.questionGroupRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findByExamId(examId: string) {
    return this.questionGroupRepository.findByExamId(examId);
  }

  findById(id: QuestionGroup['id']) {
    return this.questionGroupRepository.findById(id);
  }

  findByIds(ids: QuestionGroup['id'][]) {
    return this.questionGroupRepository.findByIds(ids);
  }

  async update(
    id: QuestionGroup['id'],

    updateQuestionGroupDto: UpdateQuestionGroupDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let toeicTest: ToeicTest | undefined = undefined;

    if (updateQuestionGroupDto.toeicTest) {
      const toeicTestObject = await this.toeicTestService.findById(
        updateQuestionGroupDto.toeicTest.id,
      );
      if (!toeicTestObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            toeicTest: 'notExists',
          },
        });
      }
      toeicTest = toeicTestObject;
    }

    return this.questionGroupRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      orderIndex: updateQuestionGroupDto.orderIndex,

      imageUrl: updateQuestionGroupDto.imageUrl,

      audioUrl: updateQuestionGroupDto.audioUrl,

      passageText: updateQuestionGroupDto.passageText,

      title: updateQuestionGroupDto.title,

      toeicTest,
    });
  }

  remove(id: QuestionGroup['id']) {
    return this.questionGroupRepository.remove(id);
  }
}
