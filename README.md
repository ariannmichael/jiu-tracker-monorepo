# Jiu Tracker Monorepo

This monorepo contains the Jiu Tracker application: a NestJS backend API and a React Native mobile app (Expo) with web support.

## Quick start (Docker)

Run the full stack (database, backend, frontend web) with the Makefile:

```bash
make setup-env   # optional: create .env from .env.docker.example
make up          # start db + backend + frontend (foreground)
# In another terminal, after services are up:
make migrate     # run database migrations (first time only)
make seed        # optional: seed data
```

- **Frontend (web):** http://localhost:8081  
- **Backend API:** http://localhost:3006  
- **Database:** PostgreSQL 16 on `localhost:5432`  

To run in the background: `make run`. To stop: `make down`. See all commands: `make help`.

## Project Structure

```
jiu-tracker-monorepo/
├── jiu-tracker-nest/     # NestJS backend API
├── jiu-tracker-mobile/   # React Native mobile app (Expo)
└── packages/
    └── shared/           # Shared TypeScript types
```

This monorepo uses **npm workspaces** to manage dependencies and share types between the frontend and backend.

## Projects

### Shared Types (`packages/shared`)

A shared TypeScript package containing common types, interfaces, and enums used by both the backend and mobile app. This provides:
- **Type safety** for API contracts
- **Single source of truth** for domain types
- **No runtime dependencies** - works in both Node.js and React Native

See [packages/shared/README.md](packages/shared/README.md) for detailed documentation.

**Building:**
```bash
npm run shared:build     # Build the shared types
npm run shared:watch     # Watch mode for development
```

### Backend (`jiu-tracker-nest`)

A NestJS (TypeScript) REST API built with:
- NestJS + TypeORM
- PostgreSQL database
- JWT auth via HTTP-only cookie
- class-validator / class-transformer for DTOs

**Getting Started:**
```bash
cd jiu-tracker-nest
cp .env.example .env
# Edit .env with your DB and SECRET
npm install
npm run start:dev
```

API runs at `http://localhost:3006` (or `PORT` from `.env`).

### Mobile App (`jiu-tracker-mobile`)

A React Native mobile application (Expo) with web support, built with:
- Expo
- TypeScript
- Expo Router for navigation

**Getting Started:**
```bash
cd jiu-tracker-mobile
npm install
npx expo start          # then press 'w' for web
# or
npm run mobile:web     # from repo root: web only
```

## Development

### Quick Start

From the root directory, you can use npm scripts to run both projects:

```bash
# Install dependencies (backend + mobile)
npm run install:all

# Run both backend and mobile app simultaneously
npm run dev

# Or run them separately
npm run dev:backend    # Run NestJS backend only
npm run dev:mobile     # Run mobile app only
```

### Available Commands

#### Shared Package Commands
- `npm run shared:build` - Build the shared types package
- `npm run shared:watch` - Watch mode for shared types development

#### Backend Commands
- `npm run backend:install` - Install backend dependencies
- `npm run backend:dev` - Run the NestJS backend in watch mode
- `npm run backend:build` - Build the NestJS backend
- `npm run backend:test` - Run backend tests
- `npm run backend:lint` - Lint backend code

#### Mobile Commands
- `npm run mobile:install` - Install mobile app dependencies
- `npm run mobile:start` - Start Expo development server
- `npm run mobile:android` - Start Expo for Android
- `npm run mobile:ios` - Start Expo for iOS
- `npm run mobile:web` - Start Expo for web
- `npm run mobile:test` - Run mobile app tests
- `npm run mobile:lint` - Lint mobile app code

#### Combined Commands
- `npm run install:all` - Install all dependencies (includes workspace linking)
- `npm run build:all` - Build shared package and backend
- `npm run dev` - Run both backend and mobile app in parallel

### Manual Development

Each project can also be developed independently. Refer to the individual project READMEs for specific setup instructions.

### Docker

The stack runs in Docker: PostgreSQL, NestJS backend, and Expo web frontend. Prefer the Makefile:

| Command        | Description                          |
|----------------|--------------------------------------|
| `make up`      | Start stack (foreground, with logs) |
| `make run`     | Start stack in background           |
| `make down`    | Stop and remove containers          |
| `make build`   | Build images only                   |
| `make ps`      | List running containers             |
| `make logs`    | Follow logs (`make logs SVC=backend` for one service) |
| `make setup-env` | Copy `.env.docker.example` → `.env` if missing |
| `make migrate` | Run database migrations             |
| `make seed`    | Run database seeds                  |

Without Make: `docker compose up --build`. Optional env: copy `.env.docker.example` to `.env` and set `DB_PASSWORD`, `JWT_SECRET`, etc.; otherwise defaults from `docker-compose.yml` are used.

### Makefile

All Make targets: run `make help` from the repo root. Local variants (no Docker): `make migrate-local`, `make seed-local`. Tests: `make test`, `make test-backend`, `make test-mobile`.

## License

[Add your license here]

