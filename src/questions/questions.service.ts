import { QuestionGroupsService } from '../question-groups/question-groups.service';
import { QuestionGroup } from '../question-groups/domain/question-group';

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
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionRepository } from './infrastructure/persistence/question.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Question } from './domain/question';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionGroupService: QuestionGroupsService,

    @Inject(forwardRef(() => ToeicTestsService))
    private readonly toeicTestService: ToeicTestsService,

    // Dependencies here
    private readonly questionRepository: QuestionRepository,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    if (!createQuestionDto.options.includes(createQuestionDto.correctAnswer)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          correctAnswer: 'correctAnswer must be one of the options',
        },
      });
    }
    // Do not remove comment below.
    // <creating-property />

    let questionGroup: QuestionGroup | null | undefined = undefined;

    if (createQuestionDto.questionGroup) {
      const questionGroupObject = await this.questionGroupService.findById(
        createQuestionDto.questionGroup.id,
      );
      if (!questionGroupObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            questionGroup: 'notExists',
          },
        });
      }
      questionGroup = questionGroupObject;
    } else if (createQuestionDto.questionGroup === null) {
      questionGroup = null;
    }

    const toeicTestObject = await this.toeicTestService.findById(
      createQuestionDto.toeicTest.id,
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

    return this.questionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      orderIndex: createQuestionDto.orderIndex,

      explanation: createQuestionDto.explanation,

      correctAnswer: createQuestionDto.correctAnswer,

      options: createQuestionDto.options,

      prompt: createQuestionDto.prompt,

      questionGroup,

      toeicTest,
    });
  }

  async createBulk(createQuestionDtos: CreateQuestionDto[]) {
    // We can just loop and create them, or implement bulk insert on repository level.
    // For simplicity and reusing the validation in `create`, we loop.
    const createdQuestions: Question[] = [];
    for (const dto of createQuestionDtos) {
      createdQuestions.push(await this.create(dto));
    }
    return createdQuestions;
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.questionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findByExamId(examId: string) {
    return this.questionRepository.findByExamId(examId);
  }

  findById(id: Question['id']) {
    return this.questionRepository.findById(id);
  }

  findByIds(ids: Question['id'][]) {
    return this.questionRepository.findByIds(ids);
  }

  async update(id: Question['id'], updateQuestionDto: UpdateQuestionDto) {
    if (
      updateQuestionDto.options &&
      updateQuestionDto.correctAnswer &&
      !updateQuestionDto.options.includes(updateQuestionDto.correctAnswer)
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          correctAnswer: 'correctAnswer must be one of the options',
        },
      });
    }
    // Do not remove comment below.
    // <updating-property />

    let questionGroup: QuestionGroup | null | undefined = undefined;

    if (updateQuestionDto.questionGroup) {
      const questionGroupObject = await this.questionGroupService.findById(
        updateQuestionDto.questionGroup.id,
      );
      if (!questionGroupObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            questionGroup: 'notExists',
          },
        });
      }
      questionGroup = questionGroupObject;
    } else if (updateQuestionDto.questionGroup === null) {
      questionGroup = null;
    }

    let toeicTest: ToeicTest | undefined = undefined;

    if (updateQuestionDto.toeicTest) {
      const toeicTestObject = await this.toeicTestService.findById(
        updateQuestionDto.toeicTest.id,
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

    return this.questionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      orderIndex: updateQuestionDto.orderIndex,

      explanation: updateQuestionDto.explanation,

      correctAnswer: updateQuestionDto.correctAnswer,

      options: updateQuestionDto.options,

      prompt: updateQuestionDto.prompt,

      questionGroup,

      toeicTest,
    });
  }

  remove(id: Question['id']) {
    return this.questionRepository.remove(id);
  }
}
