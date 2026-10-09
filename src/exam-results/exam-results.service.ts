import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { ExamResultSchemaClass } from './infrastructure/persistence/document/entities/exam-result.schema';
import { UserLeaderboardSchemaClass } from '../leaderboards/infrastructure/persistence/document/entities/user-leaderboard.schema';
import { ToeicTestsService } from '../toeic-tests/toeic-tests.service';

@Injectable()
export class ExamResultsService {
  private readonly logger = new Logger(ExamResultsService.name);

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

    const session = await this.examResultModel.db.startSession();
    session.startTransaction();

    try {
      // Insert ExamResult
      const examResult = new this.examResultModel({
        userId,
        examId,
        score,
      });
      await examResult.save({ session });

      // Upsert UserLeaderboard atomically with aggregation pipeline
      await this.userLeaderboardModel.findOneAndUpdate(
        { userId },
        [
          {
            $set: {
              totalCompletedExams: {
                $add: [{ $ifNull: ['$totalCompletedExams', 0] }, 1],
              },
              averageScore: {
                $divide: [
                  {
                    $add: [
                      {
                        $multiply: [
                          { $ifNull: ['$averageScore', 0] },
                          { $ifNull: ['$totalCompletedExams', 0] },
                        ],
                      },
                      score,
                    ],
                  },
                  {
                    $add: [{ $ifNull: ['$totalCompletedExams', 0] }, 1],
                  },
                ],
              },
            },
          },
        ],
        { upsert: true, new: true, session },
      );

      await session.commitTransaction();
      return examResult;
    } catch (error) {
      this.logger.error('Failed to create exam result', (error as Error).stack);
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
