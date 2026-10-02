import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { ExamResultSchemaClass } from './infrastructure/persistence/document/entities/exam-result.schema';
import { UserLeaderboardSchemaClass } from '../leaderboards/infrastructure/persistence/document/entities/user-leaderboard.schema';
import { ToeicTestsService } from '../toeic-tests/toeic-tests.service';

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectModel(ExamResultSchemaClass.name)
    private readonly examResultModel: Model<ExamResultSchemaClass>,
    @InjectModel(UserLeaderboardSchemaClass.name)
    private readonly userLeaderboardModel: Model<UserLeaderboardSchemaClass>,
    private readonly toeicTestsService: ToeicTestsService,
  ) {}

  async create(userId: string, createDto: CreateExamResultDto) {
    const { examId, score } = createDto;

    // Validate examId exists
    const exam = await this.toeicTestsService.findById(examId);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    // Insert ExamResult
    const examResult = new this.examResultModel({
      userId,
      examId,
      score,
    });
    await examResult.save();

    // Fetch current UserLeaderboard for user
    let leaderboard = await this.userLeaderboardModel.findOne({ userId });

    if (!leaderboard) {
      leaderboard = new this.userLeaderboardModel({
        userId,
        averageScore: score,
        totalCompletedExams: 1,
      });
    } else {
      const oldAvg = leaderboard.averageScore || 0;
      const oldTotal = leaderboard.totalCompletedExams || 0;
      const newTotal = oldTotal + 1;
      const newAverage = (oldAvg * oldTotal + score) / newTotal;

      leaderboard.averageScore = newAverage;
      leaderboard.totalCompletedExams = newTotal;
    }

    await leaderboard.save();

    return examResult;
  }
}
