# Jiu Tracker Monorepo

This monorepo contains the Jiu Tracker application, consisting of a NestJS backend API and a React Native mobile application.

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

A React Native mobile application built with:
- Expo
- TypeScript
- Expo Router for navigation

**Getting Started:**
```bash
cd jiu-tracker-mobile
npm install
npx expo start
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

## License

[Add your license here]

