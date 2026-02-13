# Build from monorepo root so workspace deps (@jiu-tracker/shared) resolve.
# Build: docker build -f jiu-tracker-nest/Dockerfile .
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files and workspace layout
COPY package.json package-lock.json ./
COPY packages ./packages
COPY jiu-tracker-nest ./jiu-tracker-nest

# Install all dependencies (including workspaces)
RUN npm ci

# Build shared package then backend
RUN npm run build -w @jiu-tracker/shared
RUN npm run build -w jiu-tracker-nest

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy root package files and only what's needed to run
COPY package.json package-lock.json ./
COPY packages ./packages
COPY jiu-tracker-nest ./jiu-tracker-nest

# Install production deps only at root; workspaces are linked
RUN npm ci --omit=dev

# Ensure shared dist exists (copy from builder)
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/jiu-tracker-nest/dist ./jiu-tracker-nest/dist

WORKDIR /app/jiu-tracker-nest

EXPOSE 3006

CMD ["node", "dist/main.js"]
