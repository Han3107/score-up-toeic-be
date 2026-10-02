import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { AuthGuard } from '@nestjs/passport';
import { getModelToken } from '@nestjs/mongoose';
import { ExamResultsController } from '../../src/exam-results/exam-results.controller';
import { ExamResultsService } from '../../src/exam-results/exam-results.service';
import { ExamResultSchemaClass } from '../../src/exam-results/infrastructure/persistence/document/entities/exam-result.schema';
import { UserLeaderboardSchemaClass } from '../../src/leaderboards/infrastructure/persistence/document/entities/user-leaderboard.schema';
import { ToeicTestsService } from '../../src/toeic-tests/toeic-tests.service';

describe('ExamResultsController (e2e)', () => {
  let app: INestApplication;

  class MockExamResultModel {
    id?: string;
    _id?: string;

    constructor(private data: any) {
      Object.assign(this, data);
    }

    save = jest.fn().mockImplementation(() => {
      this.id = 'mock-result-id';
      this._id = 'mock-result-id';
      return this;
    });
  }

  const mockUserLeaderboard = {
    userId: 'mock-user-id',
    averageScore: 0,
    totalCompletedExams: 0,
    save: jest.fn().mockResolvedValue(true),
  };

  class MockUserLeaderboardModel {
    constructor(public data: any) {
      Object.assign(mockUserLeaderboard, data);
      return mockUserLeaderboard as any;
    }
    static findOne = jest.fn().mockResolvedValue(mockUserLeaderboard);
  }

  const mockToeicTestsService = {
    findById: jest.fn().mockResolvedValue({ _id: '64d2b2f7c000000000000000' }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ExamResultsController],
      providers: [
        ExamResultsService,
        {
          provide: getModelToken(ExamResultSchemaClass.name),
          useValue: MockExamResultModel,
        },
        {
          provide: getModelToken(UserLeaderboardSchemaClass.name),
          useValue: MockUserLeaderboardModel,
        },
        { provide: ToeicTestsService, useValue: mockToeicTestsService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'mock-user-id' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI });
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should create result and update leaderboard stats', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/exam-results')
      .send({ examId: '64d2b2f7c000000000000000', score: 100 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'mock-result-id');
    expect(res.body).toHaveProperty('examId', '64d2b2f7c000000000000000');
    expect(res.body).toHaveProperty('score', 100);
  });

  it('should assert 400 on invalid score', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/exam-results')
      .send({ examId: '64d2b2f7c000000000000000', score: -10 });

    expect(res.status).toBe(400);
  });
});
