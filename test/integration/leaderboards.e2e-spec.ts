import { describe, it } from '@jest/globals';
import request from 'supertest';
import { APP_URL } from '../utils/constants';

describe('LeaderboardsController (e2e)', () => {
  const app = APP_URL;

  it('should return 401 Unauthorized without token for /api/v1/leaderboards/exams (GET)', () => {
    return request(app).get('/api/v1/leaderboards/exams').expect(401);
  });
});
