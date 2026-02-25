import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<50'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3006/api';

export default function () {
  const res = http.get(`${BASE_URL}/analytics`, {
    headers: {
      Authorization: __ENV.AUTH_HEADER || 'Bearer <token>',
    },
  });
  check(res, { 'status is 200 or 401': (r) => r.status === 200 || r.status === 401 });
  sleep(0.1);
}
