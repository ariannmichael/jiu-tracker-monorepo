# Jiu Tracker Monorepo — common tasks
# Docker targets assume compose; -local targets run on the host.

.DEFAULT_GOAL := help

.PHONY: up down run build ps logs migrate migrate-local seed seed-local test test-backend test-mobile setup-env help

# --- Docker stack ---

## Start database, backend, and frontend in foreground (builds if needed)
up:
	docker compose up --build

## Start stack in background (detached)
run:
	docker compose up -d --build

## Stop and remove containers
down:
	docker compose down

## Build images without starting
build:
	docker compose build

## List running containers
ps:
	docker compose ps

## Follow logs (optional: make logs SVC=backend)
logs:
	docker compose logs -f $(or $(SVC),)

# --- Env ---

## Copy .env.docker.example to .env if .env does not exist
setup-env:
	@if [ ! -f .env ]; then cp .env.docker.example .env && echo "Created .env from .env.docker.example"; else echo ".env already exists"; fi

# --- Migrations ---

## Run migrations in backend container (run after 'make up' or 'make run')
migrate:
	docker compose run --rm backend node /app/node_modules/typeorm/cli.js migration:run -d dist/data-source.js

## Run migrations locally (DB must be reachable, e.g. localhost)
migrate-local:
	npm run migration:run -w jiu-tracker-nest

# --- Seeds ---

## Run seeds in backend container
seed:
	docker compose run --rm backend node dist/seed.js

## Run seeds locally
seed-local:
	npm run seed -w jiu-tracker-nest

# --- Tests ---

## Run all tests (backend + mobile)
test: test-backend test-mobile

## Backend tests only
test-backend:
	npm run backend:test

## Mobile tests only
test-mobile:
	npm run mobile:test

# --- Help ---

help:
	@echo "Jiu Tracker — Make targets"
	@echo ""
	@echo "  up          Start db + backend + frontend (foreground)"
	@echo "  run         Start stack in background (detached)"
	@echo "  down        Stop and remove containers"
	@echo "  build       Build Docker images"
	@echo "  ps          List running containers"
	@echo "  logs        Follow logs (optional: make logs SVC=backend)"
	@echo ""
	@echo "  setup-env   Copy .env.docker.example to .env if missing"
	@echo ""
	@echo "  migrate         Run migrations (Docker)"
	@echo "  migrate-local  Run migrations locally"
	@echo ""
	@echo "  seed        Run seeds (Docker)"
	@echo "  seed-local  Run seeds locally"
	@echo ""
	@echo "  test          Run backend + mobile tests"
	@echo "  test-backend  Backend tests only"
	@echo "  test-mobile   Mobile tests only"
	@echo ""
	@echo "  help        Show this help"
