# How to run everything

## Prerequisites

- Node.js 20+
- npm (or pnpm/yarn)
- Docker & Docker Compose (for full stack or infra only)
- [k6](https://k6.io/docs/getting-started/installation/) (optional, for benchmarks)

---

## 1. Install dependencies

From the monorepo root:

```bash
npm install
```

This installs dependencies for all workspaces (shared, jiu-tracker-nest, jiu-tracker-mobile).

---

## 2. Run infrastructure (Postgres + Redis)

The backend needs PostgreSQL and Redis. Easiest is Docker Compose:

```bash
docker compose up -d db redis
```

Optional (not required for analytics): RabbitMQ

```bash
docker compose up -d db redis rabbitmq
```

Then set env for the backend (see below).

---

## 3. Backend (NestJS API)

### Environment

Copy the example env and set your DB/Redis/secret:

```bash
cp jiu-tracker-nest/.env.example jiu-tracker-nest/.env
# Edit jiu-tracker-nest/.env:
# - DB_PASSWORD, SECRET, etc.
# - REDIS_HOST=localhost, REDIS_PORT=6379 (if using local Redis)
```

### Migrations (first time or after schema changes)

```bash
npm run migration:run -w jiu-tracker-nest
```

Requires `DB_*` env (e.g. from `.env` or export). Uses Postgres from Docker or local.

### Start backend

**Development (watch mode):**

```bash
npm run backend:dev
# or: npm run dev:backend
# or: cd jiu-tracker-nest && npm run start:dev
```

API: `http://localhost:3006` (or `PORT` from env).

**Production (compiled):**

```bash
npm run shared:build && npm run backend:build
cd jiu-tracker-nest && npm run start:prod
```

### Useful backend URLs

- API base: `http://localhost:3006/api`
- Health: `http://localhost:3006/health`
- Readiness: `http://localhost:3006/health/ready`
- Prometheus metrics: `http://localhost:3006/metrics`

---

## 4. Mobile app (Expo)

Set the API URL (for web or device). Default is `http://localhost:3006/api`.

**Web:**

```bash
npm run mobile:web
# or: npm run dev:mobile  then choose web
```

Opens Expo web; point the app at your backend (e.g. `EXPO_PUBLIC_API_URL=http://localhost:3006/api` if different).

**iOS / Android:**

```bash
npm run mobile:start
# then press i (iOS) or a (Android) in the terminal
# or: npm run mobile:ios / npm run mobile:android
```

On a physical device, use your machine’s LAN IP for `EXPO_PUBLIC_API_URL` (e.g. `http://192.168.1.x:3006/api`).

---

## 5. Run backend + mobile together (dev)

With `db` and `redis` already up:

```bash
npm run dev
```

Runs `backend:dev` and `mobile:web` in parallel.

---

## 6. Run everything with Docker Compose

Starts Postgres, Redis, RabbitMQ, backend, and frontend (Expo web):

```bash
docker compose up --build
```

- Backend: `http://localhost:3006`
- Frontend: `http://localhost:8081` (Expo web; API URL is set to `http://localhost:3006/api`)

Backend only (no frontend container):

```bash
docker compose up -d db redis backend
```

---

## 7. Tests

**Backend unit tests:**

```bash
npm run backend:test
# or: cd jiu-tracker-nest && npm test
```

**Backend E2E tests** (need Postgres + Redis):

```bash
# Start infra first
docker compose up -d db redis

# Set env and run (from repo root)
export DB_HOST=localhost DB_PORT=5432 DB_USERNAME=postgres DB_PASSWORD=postgres DB_NAME=jiu_tracker
export REDIS_HOST=localhost REDIS_PORT=6379 SECRET=test-secret
npm run migration:run -w jiu-tracker-nest
npm run test:e2e -w jiu-tracker-nest
```

**Mobile tests:**

```bash
npm run mobile:test
```

---

## 8. Lint and build

```bash
# Lint backend
npm run backend:lint

# Build shared + backend
npm run build:all
```

---

## 9. Benchmarks (k6)

Install k6, then from repo root:

```bash
# Health endpoint (no auth)
k6 run benchmarks/baseline.js

# Analytics read (use a valid JWT for 200s)
k6 run -e AUTH_HEADER="Bearer YOUR_JWT" -e API_URL=http://localhost:3006/api benchmarks/analytics-read.js

# Analytics recompute
k6 run -e AUTH_HEADER="Bearer YOUR_JWT" -e API_URL=http://localhost:3006/api benchmarks/analytics-recompute.js
```

---

## 10. Quick reference

| Task              | Command |
|-------------------|--------|
| Install           | `npm install` |
| Infra (DB+Redis)  | `docker compose up -d db redis` |
| Backend dev       | `npm run backend:dev` |
| Mobile web       | `npm run mobile:web` |
| Backend + mobile | `npm run dev` |
| Full stack (Docker) | `docker compose up --build` |
| Migrations       | `npm run migration:run -w jiu-tracker-nest` |
| Backend tests    | `npm run backend:test` |
| E2E tests        | `npm run test:e2e -w jiu-tracker-nest` (with db+redis up) |
| Build all        | `npm run build:all` |
| k6 baseline     | `k6 run benchmarks/baseline.js` |
