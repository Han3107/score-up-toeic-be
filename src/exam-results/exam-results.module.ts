import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamResultsController } from './exam-results.controller';
import { ExamResultsService } from './exam-results.service';
import {
  ExamResultSchemaClass,
  ExamResultSchema,
} from './infrastructure/persistence/document/entities/exam-result.schema';
import {
  UserLeaderboardSchemaClass,
  UserLeaderboardSchema,
} from '../leaderboards/infrastructure/persistence/document/entities/user-leaderboard.schema';
import { ToeicTestsModule } from '../toeic-tests/toeic-tests.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamResultSchemaClass.name, schema: ExamResultSchema },
      { name: UserLeaderboardSchemaClass.name, schema: UserLeaderboardSchema },
    ]),
    ToeicTestsModule,
  ],
  controllers: [ExamResultsController],
  providers: [ExamResultsService],
})
export class ExamResultsModule {}
