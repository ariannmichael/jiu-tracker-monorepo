# Load tests (k6)

Run with [k6](https://k6.io/): `k6 run benchmarks/<script>.js`

## Scripts

- **baseline.js** – Health endpoint load. No auth. `API_URL` env optional.
- **analytics-read.js** – GET /api/analytics. Set `AUTH_HEADER=Bearer <jwt>` for 200s; otherwise expects 401.

## Targets (from plan)

- Analytics read: p95 < 50ms at 100 RPS
- Recomputation: p95 < 500ms per user
- Queue: < 1s end-to-end from event to updated analytics

## Example

```bash
# Install k6: https://k6.io/docs/getting-started/installation/
k6 run benchmarks/baseline.js
k6 run -e AUTH_HEADER="Bearer YOUR_JWT" benchmarks/analytics-read.js
```
