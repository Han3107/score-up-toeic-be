import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '15s',
  thresholds: {
    // 95% of requests must complete below 500ms
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = 'http://localhost:3000/api/v1';

export default function () {
  // Using an authorization token if required. Assuming public endpoints or mocked auth for this test.
  const params = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${__ENV.TOKEN}`, // Passed via environment variable if needed
    },
  };

  // List folders
  const listFoldersRes = http.get(`${BASE_URL}/folders?page=1&limit=10`, params);
  check(listFoldersRes, {
    'list folders status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'list folders duration < 500ms': (r) => r.timings.duration < 500,
  });

  // List modules
  const listModulesRes = http.get(`${BASE_URL}/vocabulary-modules?page=1&limit=10`, params);
  check(listModulesRes, {
    'list modules status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    'list modules duration < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
