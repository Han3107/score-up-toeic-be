import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaderboardsService } from './leaderboards.service';
import { LeaderboardsController } from './leaderboards.controller';
import {
  UserLeaderboardSchemaClass,
  UserLeaderboardSchema,
} from './infrastructure/persistence/document/entities/user-leaderboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserLeaderboardSchemaClass.name,
        schema: UserLeaderboardSchema,
      },
    ]),
  ],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
  exports: [LeaderboardsService],
})
export class LeaderboardsModule {}
