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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SyncCategoriesDto } from './dto/sync-categories.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './domain/category';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(RoleEnum.admin)
  @Post()
  @ApiCreatedResponse({
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Post('sync-defaults')
  @Roles(RoleEnum.admin)
  @ApiOkResponse({
    description: 'Synchronize default categories',
  })
  syncDefaults(@Body() syncDto: SyncCategoriesDto) {
    return this.categoriesService.syncDefaults(syncDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Category),
  })
  async findAll(
    @Request() req: any,
    @Query() query: FindAllCategoriesDto,
  ): Promise<InfinityPaginationResponseDto<Category>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    // Role-based status filtering logic
    let statusFilter = query?.status;
    const userRole = req.user?.role?.id;
    if (userRole !== RoleEnum.admin) {
      statusFilter = 'ACTIVE';
    }

    return infinityPagination(
      await this.categoriesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
        status: statusFilter,
      }),
      { page, limit },
    );
  }

  @Roles(RoleEnum.admin)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Category,
  })
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Roles(RoleEnum.admin)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Category,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
