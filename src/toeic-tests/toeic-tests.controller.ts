import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
  Req,
} from '@nestjs/common';
import { ToeicTestsService } from './toeic-tests.service';
import { QuestionsService } from '../questions/questions.service';
import { QuestionGroupsService } from '../question-groups/question-groups.service';
import { CreateToeicTestDto } from './dto/create-toeic-test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic-test.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ToeicTest } from './domain/toeic-test';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllToeicTestsDto } from './dto/find-all-toeic-tests.dto';
import { RoleEnum } from '../roles/roles.enum';

@ApiTags('Toeictests')
@Controller({
  path: 'toeic-tests',
  version: '1',
})
export class ToeicTestsController {
  constructor(
    private readonly toeicTestsService: ToeicTestsService,
    @Inject(forwardRef(() => QuestionsService))
    private readonly questionsService: QuestionsService,
    @Inject(forwardRef(() => QuestionGroupsService))
    private readonly questionGroupsService: QuestionGroupsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/full')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async getFullExam(@Param('id') id: string) {
    const exam = await this.toeicTestsService.findById(id);
    if (!exam || exam.status !== 'PUBLISHED') {
      throw new NotFoundException('Exam not found or not published');
    }

    const questions = await this.questionsService.findByExamId(id);
    if (!questions || questions.length === 0) {
      throw new BadRequestException('Cannot start an exam with 0 questions');
    }

    const groups = await this.questionGroupsService.findByExamId(id);

    const standaloneQuestions = questions.filter((q) => !q.questionGroup);
    const groupedQuestions = groups.map((group) => ({
      ...group,
      questions: questions.filter(
        (q) => q.questionGroup && q.questionGroup.id === group.id,
      ),
    }));

    return {
      ...exam,
      groups: groupedQuestions,
      standaloneQuestions,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiCreatedResponse({
    type: ToeicTest,
  })
  create(@Body() createToeicTestDto: CreateToeicTestDto) {
    return this.toeicTestsService.create(createToeicTestDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ToeicTest),
  })
  async findAll(
    @Req() request: any,
    @Query() query: FindAllToeicTestsDto,
  ): Promise<InfinityPaginationResponseDto<ToeicTest>> {
    const isAdmin = request.user?.role?.id === RoleEnum.admin;
    const statusFilter = isAdmin ? query.status : 'PUBLISHED';
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.toeicTestsService.findAllWithPagination({
        status: statusFilter,
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: ToeicTest,
  })
  async findById(@Req() request: any, @Param('id') id: string) {
    const isAdmin = request.user?.role?.id === RoleEnum.admin;
    const exam = await this.toeicTestsService.findById(id);
    if (!isAdmin && exam?.status !== 'PUBLISHED') {
      throw new NotFoundException('Exam not found or not published');
    }
    return exam;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: ToeicTest,
  })
  update(
    @Param('id') id: string,
    @Body() updateToeicTestDto: UpdateToeicTestDto,
  ) {
    return this.toeicTestsService.update(id, updateToeicTestDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.toeicTestsService.remove(id);
  }
}
