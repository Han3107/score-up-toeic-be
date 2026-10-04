import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ExamsService {
  constructor(private readonly usersService: UsersService) {}

  async completeExam(userId: string, newScore: number) {
    // This logic recalculates averageScore, increments totalCompletedExams, and updates lastExamCompletedAt

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentStats = user.leaderboardStats || {
      averageScore: 0,
      totalCompletedExams: 0,
      lastExamCompletedAt: new Date(0),
    };

    const totalExams = currentStats.totalCompletedExams;
    const currentAverage = currentStats.averageScore;

    // Running average calculation
    const newTotalExams = totalExams + 1;
    const newAverage = (currentAverage * totalExams + newScore) / newTotalExams;

    const updatedStats = {
      averageScore: newAverage,
      totalCompletedExams: newTotalExams,
      lastExamCompletedAt: new Date(),
    };

    await this.usersService.update(userId, {
      leaderboardStats: updatedStats,
    });

    return updatedStats;
  }
}
