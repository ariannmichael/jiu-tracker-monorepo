# @jiu-tracker/shared

Shared TypeScript types for the Jiu Tracker monorepo.

## Overview

This package contains common types, interfaces, and enums used by both the backend API (jiu-tracker-nest) and mobile app (jiu-tracker-mobile). It provides a single source of truth for API contracts and domain types.

## Installation

This package is automatically linked via npm workspaces. Both `jiu-tracker-mobile` and `jiu-tracker-nest` list it as a dependency.

## Building

```bash
# From the root of the monorepo
npm run shared:build

# Or in watch mode
npm run shared:watch
```

## Usage

### In the mobile app

```typescript
import { TechniqueListItem, TechniquesListResponse, Category, Difficulty } from '@jiu-tracker/shared';

// Use in services
async function getTechniquesList(): Promise<TechniquesListResponse> {
  const response = await fetch('/api/techniques/list');
  return response.json();
}

// Use in components
const [techniques, setTechniques] = useState<TechniqueListItem[]>([]);
```

### In the backend

```typescript
import { Difficulty, Category } from '@jiu-tracker/shared';

// Enums are imported from shared to maintain a single source of truth
// DTOs can implement shared interfaces or use them as return types
```

## Structure

- `src/technique.ts` - Technique types, enums (Category, Difficulty), and API contracts
- `src/training.ts` - Training session types and API contracts
- `src/user.ts` - User types and API contracts (without sensitive fields like password)
- `src/index.ts` - Main entry point, re-exports all types

## Design Principles

1. **No dependencies**: This package has zero runtime dependencies to work in both Node.js and React Native
2. **No decorators**: Plain TypeScript interfaces and enums only (no Nest, TypeORM, or validation decorators)
3. **API contract**: Property names match the JSON API contract (e.g., `name_portuguese`, `user_id`)
4. **Type safety**: Provides compile-time safety for API requests and responses

## Development

After making changes:

1. Build the package: `npm run shared:build`
2. The changes will be immediately available to both apps via workspace linking
3. No need to reinstall or update versions

## Notes

- The backend keeps its DTOs for validation (class-validator) and entities for ORM (TypeORM)
- Shared types document the API contract and provide type safety
- DTOs can implement shared interfaces to guarantee matching contracts
