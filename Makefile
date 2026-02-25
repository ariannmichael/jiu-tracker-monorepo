# Jiu Tracker Monorepo — Makefile
# Run `make help` for targets.

.PHONY: help install env infra infra-down migrate build \
	backend-dev backend-build backend-start backend-test backend-lint backend-e2e \
	mobile-start mobile-web mobile-ios mobile-android mobile-test mobile-lint \
	dev docker-up docker-down docker-build \
	test test-e2e benchmark-baseline benchmark-analytics-read benchmark-analytics-recompute clean

# Default target
help:
	@echo "Jiu Tracker — available targets:"
	@echo ""
	@echo "  setup          install deps + copy .env.example → .env (edit before use)"
	@echo "  install        npm install (all workspaces)"
	@echo "  env            copy jiu-tracker-nest/.env.example → .env"
	@echo "  infra          start Postgres + Redis (docker compose up -d db redis)"
	@echo "  infra-down     stop infra containers"
	@echo "  migrate        run backend TypeORM migrations"
	@echo "  build          build shared + backend"
	@echo ""
	@echo "  backend-dev    start Nest backend (watch)"
	@echo "  backend-build  compile backend"
	@echo "  backend-start  start backend (production build)"
	@echo "  backend-test   backend unit tests"
	@echo "  backend-lint   backend ESLint"
	@echo "  backend-e2e    backend E2E (requires infra + migrate)"
	@echo ""
	@echo "  mobile-start   expo start"
	@echo "  mobile-web     expo start --web"
	@echo "  mobile-ios     expo start --ios"
	@echo "  mobile-android expo start --android"
	@echo "  mobile-test    mobile Jest"
	@echo "  mobile-lint    mobile lint"
	@echo ""
	@echo "  dev            backend + mobile web in parallel"
	@echo "  docker-up      full stack (db, redis, rabbitmq, backend, frontend)"
	@echo "  docker-down    stop all compose services"
	@echo "  docker-build   build backend + frontend images"
	@echo ""
	@echo "  test           backend unit tests"
	@echo "  test-e2e       backend E2E (infra must be up, run migrate first)"
	@echo "  benchmark-baseline         k6 health check (no auth)"
	@echo "  benchmark-analytics-read   k6 GET /api/analytics (set AUTH_HEADER)"
	@echo "  benchmark-analytics-recompute  k6 POST /api/analytics/recompute (set AUTH_HEADER)"
	@echo ""
	@echo "  clean          docker compose down + remove backend dist"
	@echo ""
	@echo "Override: API_URL=http://localhost:3006 API_URL_API=http://localhost:3006/api AUTH_HEADER='Bearer <jwt>'"

# --- Setup ---
install:
	npm install

env:
	@test -f jiu-tracker-nest/.env || cp jiu-tracker-nest/.env.example jiu-tracker-nest/.env
	@echo "Created/kept jiu-tracker-nest/.env — edit DB_PASSWORD, SECRET, REDIS_* as needed."

setup: install env
	@echo "Run: make infra && make migrate && make backend-dev"

# --- Infrastructure ---
infra:
	docker compose up -d db redis

infra-down:
	docker compose stop db redis

# --- Migrations ---
migrate:
	npm run migration:run -w jiu-tracker-nest

# --- Build ---
build:
	npm run shared:build && npm run backend:build

# --- Backend ---
backend-dev:
	npm run backend:dev

backend-build: build

backend-start: build
	cd jiu-tracker-nest && npm run start:prod

backend-test:
	npm run backend:test

backend-lint:
	npm run backend:lint

backend-e2e:
	npm run test:e2e -w jiu-tracker-nest

# --- Mobile ---
mobile-start:
	npm run mobile:start

mobile-web:
	npm run mobile:web

mobile-ios:
	npm run mobile:ios

mobile-android:
	npm run mobile:android

mobile-test:
	npm run mobile:test

mobile-lint:
	npm run mobile:lint

# --- Dev (parallel) ---
dev:
	npm run dev

# --- Docker full stack ---
docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-build:
	docker compose build

# --- Tests ---
test: backend-test

test-e2e: backend-e2e

# --- Benchmarks (k6) ---
API_URL ?= http://localhost:3006
API_URL_API ?= $(API_URL)/api
AUTH_HEADER ?= Bearer

benchmark-baseline:
	k6 run -e API_URL=$(API_URL) benchmarks/baseline.js

benchmark-analytics-read:
	k6 run -e API_URL=$(API_URL_API) -e AUTH_HEADER="$(AUTH_HEADER)" benchmarks/analytics-read.js

benchmark-analytics-recompute:
	k6 run -e API_URL=$(API_URL_API) -e AUTH_HEADER="$(AUTH_HEADER)" benchmarks/analytics-recompute.js

# --- Clean ---
clean: infra-down
	docker compose down 2>/dev/null || true
	rm -rf jiu-tracker-nest/dist
	@echo "Stopped infra and removed backend dist."
