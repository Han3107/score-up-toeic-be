import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLeaderboardSchemaClass } from './infrastructure/persistence/document/entities/user-leaderboard.schema';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class LeaderboardsService {
  constructor(
    @InjectModel(UserLeaderboardSchemaClass.name)
    private readonly userLeaderboardModel: Model<UserLeaderboardSchemaClass>,
  ) {}

  async findAll(paginationOptions: IPaginationOptions) {
    const { page = 1, limit = 10 } = paginationOptions;
    const skip = (page - 1) * limit;

    const data = await this.userLeaderboardModel
      .find()
      .sort({ averageScore: -1, totalCompletedExams: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName photo')
      .exec();

    return data;
  }
}
