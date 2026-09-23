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
} from '@nestjs/common';
import { QuestionGroupsService } from './question-groups.service';
import { CreateQuestionGroupDto } from './dto/create-question-group.dto';
import { UpdateQuestionGroupDto } from './dto/update-question-group.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionGroup } from './domain/question-group';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllQuestionGroupsDto } from './dto/find-all-question-groups.dto';

@ApiTags('Questiongroups')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'question-groups',
  version: '1',
})
export class QuestionGroupsController {
  constructor(private readonly questionGroupsService: QuestionGroupsService) {}

  @Post()
  @ApiCreatedResponse({
    type: QuestionGroup,
  })
  create(@Body() createQuestionGroupDto: CreateQuestionGroupDto) {
    return this.questionGroupsService.create(createQuestionGroupDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(QuestionGroup),
  })
  async findAll(
    @Query() query: FindAllQuestionGroupsDto,
  ): Promise<InfinityPaginationResponseDto<QuestionGroup>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.questionGroupsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: QuestionGroup,
  })
  findById(@Param('id') id: string) {
    return this.questionGroupsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: QuestionGroup,
  })
  update(
    @Param('id') id: string,
    @Body() updateQuestionGroupDto: UpdateQuestionGroupDto,
  ) {
    return this.questionGroupsService.update(id, updateQuestionGroupDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.questionGroupsService.remove(id);
  }
}
