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
  Request,
} from '@nestjs/common';
import { VocabularyModulesService } from './vocabulary-modules.service';
import { CreateVocabularyModuleDto } from './dto/create-vocabulary-module.dto';
import { UpdateVocabularyModuleDto } from './dto/update-vocabulary-module.dto';
import { CloneVocabularyModuleDto } from './dto/clone-vocabulary-module.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { VocabularyModule } from './domain/vocabulary-module';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllVocabularyModulesDto } from './dto/find-all-vocabulary-modules.dto';

@ApiTags('Vocabularymodules')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'vocabulary-modules',
  version: '1',
})
export class VocabularyModulesController {
  constructor(
    private readonly vocabularyModulesService: VocabularyModulesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: VocabularyModule,
  })
  create(
    @Request() req: any,
    @Body() createVocabularyModuleDto: CreateVocabularyModuleDto,
  ) {
    return this.vocabularyModulesService.create(
      createVocabularyModuleDto,
      req.user.id,
    );
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(VocabularyModule),
  })
  async findAll(
    @Request() req: any,
    @Query() query: FindAllVocabularyModulesDto,
  ): Promise<InfinityPaginationResponseDto<VocabularyModule>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.vocabularyModulesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
        userId: req.user.id,
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
  @ApiQuery({
    name: 'random',
    type: Boolean,
    required: false,
    description: 'If true, randomizes the order of the vocabulary terms.',
  })
  @ApiOkResponse({
    type: VocabularyModule,
  })
  findById(
    @Request() req: any,
    @Param('id') id: string,
    @Query('random') random?: boolean,
  ) {
    // string true to boolean conversion
    const isRandom = random === true || String(random).toLowerCase() === 'true';
    return this.vocabularyModulesService.findById(id, req.user.id, isRandom);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: VocabularyModule,
  })
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateVocabularyModuleDto: UpdateVocabularyModuleDto,
  ) {
    return this.vocabularyModulesService.update(
      id,
      updateVocabularyModuleDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.vocabularyModulesService.remove(id, req.user.id);
  }

  @Post(':id/restore')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: VocabularyModule,
  })
  restore(@Request() req: any, @Param('id') id: string) {
    return this.vocabularyModulesService.restore(id, req.user.id);
  }

  @Post(':id/clone')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiCreatedResponse({
    type: VocabularyModule,
  })
  clone(
    @Request() req: any,
    @Param('id') id: string,
    @Body() cloneDto: CloneVocabularyModuleDto,
  ) {
    return this.vocabularyModulesService.clone(
      id,
      req.user.id,
      cloneDto.targetFolderId,
    );
  }
}
