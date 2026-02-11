# Jiu Tracker API (NestJS)

NestJS migration of the Jiu Tracker Go backend. REST API for Brazilian Jiu-Jitsu training tracking: users, techniques, training sessions, and belt progress.

## Stack

- **NestJS** (TypeScript)
- **TypeORM** + **PostgreSQL**
- **JWT** auth via HTTP-only cookie (same contract as Go backend)
- **class-validator** / **class-transformer** for DTOs

## Setup

```bash
cp .env.example .env
# Edit .env with your DB_URL and SECRET

npm install
npm run start:dev
```

API runs at `http://localhost:3006` (or `PORT` from `.env`).

## API Routes (prefix `/api`)

| Method | Route | Auth | Description |
|--------|--------|------|-------------|
| POST | `/user/signup` | no | Register user (name, username, email, password, belt_color, belt_stripe) |
| POST | `/user/login` | no | Login; sets `Authorization` cookie |
| GET | `/user/validate` | yes | Check JWT |
| GET | `/user/:id` | yes | Get user by ID |
| GET | `/users` | yes | List all users |
| PUT | `/user/:id` | yes | Update user |
| POST | `/training` | yes | Create training (user_id, techniques_ids, duration, notes) |
| GET | `/training/:id` | yes | Get training by ID |
| GET | `/trainings` | yes | List all trainings |
| PUT | `/training/:id` | yes | Update training |
| DELETE | `/training/:id` | yes | Delete training |
| POST | `/technique` | yes | Create technique |
| GET | `/technique/:id` | yes | Get technique by ID |
| GET | `/techniques` | yes | List all techniques |
| PUT | `/technique/:id` | yes | Update technique |

Protected routes require the `Authorization` cookie set by `/user/login`.

## Project structure (Clean Architecture)

```
src/
├── config/           # DB config
├── common/            # JWT strategy, auth guard
├── modules/
│   ├── user/          # domain, application (DTOs + service), infrastructure (repo), presentation (controller)
│   ├── training/
│   ├── technique/
│   └── belt/
├── app.module.ts
└── main.ts
```

## Scripts

- `npm run start` – run once
- `npm run start:dev` – watch mode
- `npm run build` – compile
- `npm run start:prod` – run compiled `dist/main.js`
