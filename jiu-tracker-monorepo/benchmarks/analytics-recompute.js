import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3006/api';

export default function () {
  const res = http.post(
    `${BASE_URL}/analytics/recompute`,
    null,
    {
      headers: {
        Authorization: __ENV.AUTH_HEADER || 'Bearer <token>',
      },
    },
  );
  check(res, { 'recompute status 200': (r) => r.status === 200 });
  sleep(1);
}
