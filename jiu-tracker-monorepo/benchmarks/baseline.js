import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '40s', target: 20 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3006';

export default function () {
  const res = http.get(`${BASE_URL}/health`);
  check(res, { 'health status 200': (r) => r.status === 200 });
  sleep(0.5);
}
