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
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Folder } from './domain/folder';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllFoldersDto } from './dto/find-all-folders.dto';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'folders',
  version: '1',
})
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  @ApiCreatedResponse({
    type: Folder,
  })
  create(@Request() req: any, @Body() createFolderDto: CreateFolderDto) {
    return this.foldersService.create(createFolderDto, req.user.id);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Folder),
  })
  async findAll(
    @Request() req: any,
    @Query() query: FindAllFoldersDto,
  ): Promise<InfinityPaginationResponseDto<Folder>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.foldersService.findAllWithPagination({
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
    name: 'includeModules',
    type: Boolean,
    required: false,
    description:
      'If true, fetches and attaches the vocabulary modules associated with this folder.',
  })
  @ApiOkResponse({
    type: Folder,
  })
  findById(
    @Request() req: any,
    @Param('id') id: string,
    @Query('includeModules') includeModules?: boolean,
  ) {
    const shouldInclude =
      includeModules === true ||
      String(includeModules).toLowerCase() === 'true';
    return this.foldersService.findById(id, req.user.id, shouldInclude);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Folder,
  })
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return this.foldersService.update(id, updateFolderDto, req.user.id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.foldersService.remove(id, req.user.id);
  }

  @Post(':id/restore')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Folder,
  })
  restore(@Request() req: any, @Param('id') id: string) {
    return this.foldersService.restore(id, req.user.id);
  }
}
