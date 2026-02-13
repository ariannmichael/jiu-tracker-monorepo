# Build from monorepo root so workspace dep (@jiu-tracker/shared) resolves.
# Build: docker build -f jiu-tracker-mobile/Dockerfile .
FROM node:20-alpine

WORKDIR /app

# Copy root and workspaces
COPY package.json package-lock.json ./
COPY packages ./packages
COPY jiu-tracker-mobile ./jiu-tracker-mobile

RUN npm ci

# Build shared package (mobile depends on it)
RUN npm run build -w @jiu-tracker/shared

WORKDIR /app/jiu-tracker-mobile

# Serve the web app (Expo for web); EXPO_PUBLIC_API_URL set in docker-compose
EXPOSE 8081

# Run Expo in web-only mode. --host must be one of: lan | tunnel | localhost
CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "lan"]
