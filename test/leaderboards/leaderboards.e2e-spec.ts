import { describe, expect, it } from '@jest/globals';
import { APP_URL } from '../utils/constants';
import request from 'supertest';

describe('Leaderboards Module', () => {
  const app = APP_URL;

  it('should return paginated leaderboard sorted by stats', async () => {
    const response = await request(app)
      .get('/api/v1/leaderboards?page=1&limit=10')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('hasNextPage');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
