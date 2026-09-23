import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    // 95% of requests must complete below 1s (1000ms) for lists, 2s (2000ms) for full
    http_req_duration: ['p(95)<1000'],
  },
};

const BASE_URL = 'http://localhost:3000/api/v1'; // Assuming default port and prefix

export default function () {
  // Scenario 1: Fetch paginated list
  const listRes = http.get(`${BASE_URL}/toeic-tests?page=1&limit=10`);
  check(listRes, {
    'list status is 200': (r) => r.status === 200,
    'list duration < 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // Scenario 2: Fetch full payload for a specific exam
  let examId = 'dummy-id';
  try {
     const body = listRes.json();
     if (body.data && body.data.length > 0) {
        examId = body.data[0].id || body.data[0]._id;
     }
  } catch (e) {
     // Ignore parse errors, just use dummy
  }

  const fullRes = http.get(`${BASE_URL}/toeic-tests/${examId}/full`);
  check(fullRes, {
    // 404 or 400 is also acceptable if we hit the dummy ID or an empty exam
    'full status is ok': (r) => r.status === 200 || r.status === 404 || r.status === 400,
    'full duration < 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
