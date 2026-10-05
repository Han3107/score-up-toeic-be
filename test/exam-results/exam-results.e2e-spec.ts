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

  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

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

    static db = {
      startSession: jest.fn().mockResolvedValue(mockSession),
    };
  }

  class MockUserLeaderboardModel {
    static findOneAndUpdate = jest.fn().mockResolvedValue(true);
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should create result and update leaderboard stats atomically', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/exam-results')
      .send({ examId: '64d2b2f7c000000000000000', score: 100 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'mock-result-id');
    expect(res.body).toHaveProperty('examId', '64d2b2f7c000000000000000');
    expect(res.body).toHaveProperty('score', 100);

    // Verify transaction methods were called
    expect(MockExamResultModel.db.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();

    // Verify atomic pipeline update
    expect(MockUserLeaderboardModel.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'mock-user-id' },
      expect.any(Array),
      { upsert: true, new: true, session: mockSession },
    );

    // Verify pipeline contents
    const pipeline = MockUserLeaderboardModel.findOneAndUpdate.mock.calls[0][1];
    expect(pipeline[0].$set).toBeDefined();
    expect(pipeline[0].$set.totalCompletedExams).toBeDefined();
    expect(pipeline[0].$set.averageScore).toBeDefined();
  });

  it('should assert 400 on invalid score', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/exam-results')
      .send({ examId: '64d2b2f7c000000000000000', score: -10 });

    expect(res.status).toBe(400);
  });
});
