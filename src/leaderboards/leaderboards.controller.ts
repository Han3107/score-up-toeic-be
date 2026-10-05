import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LeaderboardsService } from './leaderboards.service';
import { FindAllLeaderboardsDto } from './dto/find-all-leaderboards.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserLeaderboard } from './domain/user-leaderboard';

@ApiTags('Leaderboards')
@Controller({
  path: 'leaderboards',
  version: '1',
})
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(UserLeaderboard),
  })
  async findAll(@Query() query: FindAllLeaderboardsDto) {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const data = await this.leaderboardsService.findAll({ page, limit });

    return infinityPagination(data, { page, limit });
  }
}
