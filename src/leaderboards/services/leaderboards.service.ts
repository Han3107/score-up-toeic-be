import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserSchemaClass,
  UserSchemaDocument,
} from '../../users/infrastructure/persistence/document/entities/user.schema';

@Injectable()
export class LeaderboardsService {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private userModel: Model<UserSchemaDocument>,
  ) {}

  async getExamLeaderboard(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const query = {
      'leaderboardStats.totalCompletedExams': { $gt: 0 },
    };

    const totalItems = await this.userModel.countDocuments(query);
    const users = await this.userModel
      .find(query)
      .sort({
        'leaderboardStats.averageScore': -1,
        'leaderboardStats.totalCompletedExams': -1,
        'leaderboardStats.lastExamCompletedAt': 1,
      })
      .skip(skip)
      .limit(limit)
      .exec();

    if (totalItems === 0) {
      return {
        data: {
          items: [],
          meta: {
            currentPage: page,
            itemsPerPage: limit,
            totalItems: 0,
            totalPages: 0,
          },
          message: 'No ranked players yet',
        },
      };
    }

    const items = users.map((user, index) => ({
      rank: skip + index + 1,
      userId: user._id,
      displayName:
        user.firstName || user.lastName
          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
          : 'Anonymous',
      averageScore: user.leaderboardStats?.averageScore || 0,
      totalCompletedExams: user.leaderboardStats?.totalCompletedExams || 0,
    }));

    return {
      data: {
        items,
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      },
    };
  }
}
