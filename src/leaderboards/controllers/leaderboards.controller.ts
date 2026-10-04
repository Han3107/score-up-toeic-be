import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LeaderboardsService } from '../services/leaderboards.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Leaderboards')
@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns the paginated exam leaderboard' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('exams')
  async getExamLeaderboard(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.leaderboardsService.getExamLeaderboard(
      Number(page),
      Number(limit),
    );
  }
}
