import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from './exams.service';
import { UsersService } from '../../users/users.service';

describe('ExamsService', () => {
  let service: ExamsService;
  let mockUsersService: any;

  beforeEach(async () => {
    mockUsersService = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should recalculate stats correctly for a new exam', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'user1',
      leaderboardStats: {
        averageScore: 80,
        totalCompletedExams: 1,
        lastExamCompletedAt: new Date(),
      },
    });

    const result = await service.completeExam('user1', 90);

    expect(result.totalCompletedExams).toBe(2);
    expect(result.averageScore).toBe(85);
    expect(mockUsersService.update).toHaveBeenCalledWith('user1', {
      leaderboardStats: result,
    });
  });

  it('should calculate correctly for the very first exam', async () => {
    mockUsersService.findById.mockResolvedValue({
      id: 'user2',
    });

    const result = await service.completeExam('user2', 100);

    expect(result.totalCompletedExams).toBe(1);
    expect(result.averageScore).toBe(100);
    expect(mockUsersService.update).toHaveBeenCalledWith('user2', {
      leaderboardStats: result,
    });
  });
});
