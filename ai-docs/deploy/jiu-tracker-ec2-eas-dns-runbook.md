# Jiu Tracker: EC2, Docker, migrations, EAS Android, DNS & HTTPS — full runbook

This document captures **end-to-end context** from production setup and troubleshooting: single EC2 with Docker Compose, Nest API, Postgres migrations, Expo EAS Android builds, Nginx + Let’s Encrypt, Route 53 / Elastic IP, and common failures with fixes.

**Audience:** operators and future AI agents maintaining this stack.

**Related files in-repo:**

- `ai-docs/deploy/ec2-nginx-https.md` — focused Nginx + Certbot walkthrough
- `deploy/nginx-api.example.conf` — copy-paste server block template
- `docker-compose.yml` (monorepo root) — `db`, `redis`, `rabbitmq`, `backend`, optional `frontend`
- `jiu-tracker-nest/Dockerfile` — backend image build
- `jiu-tracker-mobile/eas.json` — EAS profiles + Android image

---

## Table of contents

1. [High-level architecture](#1-high-level-architecture)
2. [Why EC2 + Docker Compose (vs RDS / ECS)](#2-why-ec2--docker-compose-vs-rds--ecs)
3. [EC2 provisioning checklist](#3-ec2-provisioning-checklist)
4. [SSH: access and “different IP”](#4-ssh-access-and-different-ip)
5. [Docker and Docker Compose on EC2](#5-docker-and-docker-compose-on-ec2)
6. [Docker Buildx version](#6-docker-buildx-version)
7. [Running the stack](#7-running-the-stack)
8. [Inspecting containers](#8-inspecting-containers)
9. [Security group: API port 3006](#9-security-group-api-port-3006)
10. [Backend container: `Cannot find module dist/main.js`](#10-backend-container-cannot-find-module-distmainjs)
11. [Database: `DB_HOST` meaning](#11-database-db_host-meaning)
12. [Node.js on EC2 (migrations)](#12-nodejs-on-ec2-migrations)
13. [Running TypeORM migrations](#13-running-typeorm-migrations)
14. [Migration failures we hit (and fixes)](#14-migration-failures-we-hit-and-fixes)
15. [`@jiu-tracker/shared` and EAS Metro](#15-jiu-trackershared-and-eas-metro)
16. [EAS Android: Gradle / Expo](#16-eas-android-gradle--expo)
17. [Nginx reverse proxy + HTTPS](#17-nginx-reverse-proxy--https)
18. [DNS, Elastic IP, and “works by IP but not by hostname”](#18-dns-elastic-ip-and-works-by-ip-but-not-by-hostname)
19. [Mobile app API URL](#19-mobile-app-api-url)
20. [CORS, mixed content, HTTPS](#20-cors-mixed-content-https)
21. [Files changed in the monorepo (reference)](#21-files-changed-in-the-monorepo-reference)
22. [Verification checklist](#22-verification-checklist)
23. [Session changelog (detailed)](#23-session-changelog-detailed)

---

## 1. High-level architecture

| Component | Role |
|-----------|------|
| **EC2** | One Linux host (e.g. Amazon Linux 2023 or Ubuntu). |
| **Docker Compose** | Runs **PostgreSQL**, **Redis** (BullMQ), **RabbitMQ**, and **jiu-tracker-nest** backend. Published port **3006** for HTTP API. |
| **jiu-tracker-nest** | NestJS; `main.ts` listens on `PORT` (default **3006**). CORS enabled for mobile. Routes under `/api` from the app’s perspective (`EXPO_PUBLIC_API_URL` ends with `/api`). |
| **jiu-tracker-mobile** | Expo (SDK 52); `services/api.ts` uses `EXPO_PUBLIC_API_URL`. Android release builds via **EAS Build**. |
| **Nginx** | Installed on the **host** (not in Docker). Listens **80** and **443**; proxies to `http://127.0.0.1:3006`. |
| **Certbot** | Let’s Encrypt certificates for `aws.jiutracker.com` (or your API hostname). |
| **Elastic IP** | Stable public IPv4 **attached to the EC2 instance** that runs Nginx + Docker. |
| **DNS (Route 53 or registrar)** | **A record**: `aws.jiutracker.com` → that Elastic IP **only** (no second stale IP). |

**Production API URL for clients:** `https://aws.jiutracker.com/api` (no `:3006` in the URL users see).

---

## 2. Why EC2 + Docker Compose (vs RDS / ECS)

We chose a **single EC2** running the existing `docker-compose.yml` so Postgres, Redis, RabbitMQ, and Nest stay on one machine with minimal AWS surface area. Alternatives documented elsewhere:

- **RDS + ElastiCache + Amazon MQ + ECS Fargate** — more managed, more moving parts.
- This runbook assumes **Compose on EC2** unless stated otherwise.

---

## 3. EC2 provisioning checklist

- **AMI:** Amazon Linux 2023 or Ubuntu 22.04 LTS.
- **Instance size:** e.g. `t3.small` or `t3.medium` (2 GB RAM minimum is tight for multiple containers; 4 GB is more comfortable).
- **Storage:** 20–30 GB gp3.
- **Subnet:** **Public subnet** with **Internet Gateway** if you need a public IP / Elastic IP for direct access.
- **Elastic IP:** Allocate and **associate** to **this** instance (see [§18](#18-dns-elastic-ip-and-works-by-ip-but-not-by-hostname)).
- **Key pair:** Download `.pem` for SSH; `chmod 400 key.pem`.

---

## 4. SSH: access and “different IP”

**Symptom:** `ssh` times out or permission denied after working before.

**Cause:** Security group inbound **SSH (22)** allowed only **“My IP”**; your home/office IP changed.

**Fix:**

1. EC2 → instance → **Security** → security group → **Edit inbound rules**.
2. For port **22**, set **Source** to **My IP** again (refreshes current IP) or temporarily `0.0.0.0/0` (less secure; tighten later).
3. Use correct user: **`ec2-user`** (Amazon Linux) or **`ubuntu`** (Ubuntu).

**Command:**

```bash
chmod 400 /path/to/key.pem
ssh -i /path/to/key.pem ec2-user@<PUBLIC-IP-OR-ELASTIC-IP>
```

---

## 5. Docker and Docker Compose on EC2

**Install Docker (Amazon Linux 2023 example):**

```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker ec2-user
# Log out and back in so `docker` works without sudo
```

**Compose:**

- If `docker compose up -d` fails with `unknown shorthand flag: 'd' in -d`, the **Compose V2 plugin** may be missing. Either:
  - Use **`docker-compose`** (hyphen): `docker-compose up -d ...`, or
  - Install plugin: `sudo yum install -y docker-compose-plugin` (AL2023) / `sudo apt install docker-compose-plugin` (Ubuntu).

**If `docker-compose: command not found`:**

```bash
# Amazon Linux 2023
sudo yum install -y docker-compose-plugin
# Or standalone binary:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

## 6. Docker Buildx version

**Error:** `compose build requires buildx 0.17.0 or later` while Buildx reports `0.12.x`.

**Fix:** Install a newer Buildx binary into the CLI plugins path:

```bash
mkdir -p ~/.docker/cli-plugins
curl -sL "https://github.com/docker/buildx/releases/download/v0.19.3/buildx-v0.19.3.linux-amd64" -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx
docker buildx version
```

**ARM64 (Graviton):** use `linux-arm64` in the URL.

**Temporary workaround:** `export DOCKER_BUILDKIT=0` and `export COMPOSE_DOCKER_CLI_BUILD=0` before `docker-compose build` (may fail if Dockerfile requires BuildKit).

---

## 7. Running the stack

From **monorepo root** (where `docker-compose.yml` and `.env` live):

```bash
cd /path/to/jiu-tracker-monorepo
# .env should define DB_*, JWT_SECRET, REDIS_*, RABBITMQ_* as in .env.docker.example
docker-compose up -d db redis rabbitmq
docker-compose up -d backend
# Optional: frontend (Expo web) with EXPO_PUBLIC_API_URL set in compose
```

**Health check (on EC2):**

```bash
curl -s http://127.0.0.1:3006/health
```

---

## 8. Inspecting containers

```bash
cd /path/to/jiu-tracker-monorepo
docker-compose ps
docker ps -a
docker-compose logs backend
docker-compose logs -f backend
```

**Shell inside backend container:**

```bash
docker-compose exec backend sh
# or by name, e.g. jiu-tracker-monorepo-backend-1
docker exec -it <container-name> sh
```

---

## 9. Security group: API port 3006

For direct HTTP to Nest (before or beside Nginx):

- **Type:** Custom TCP  
- **Port:** 3006  
- **Source:** your IP or `0.0.0.0/0` for testing  

After Nginx + HTTPS-only, you can **remove 3006** from the internet-facing rules and keep only **80**, **443**, **22**.

---

## 10. Backend container: `Cannot find module dist/main.js`

**Error:** `Error: Cannot find module '/app/jiu-tracker-nest/dist/main.js'`

**Cause:** Nest/TypeScript with `module: "nodenext"` may emit **`dist/src/main.js`** instead of `dist/main.js`. The Dockerfile `CMD` must match the real file.

**Diagnose:**

```bash
docker run --rm --entrypoint sh <backend-image> -c "ls -la /app/jiu-tracker-nest/dist/"
```

**Fix:** In `jiu-tracker-nest/Dockerfile`, set:

```dockerfile
CMD ["node", "dist/src/main.js"]
```

if `main.js` lives under `dist/src/`. Rebuild:

```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

---

## 11. Database: `DB_HOST` meaning

| Where the command runs | `DB_HOST` value |
|-------------------------|-----------------|
| **Inside Docker** (backend service) | **`db`** — Compose DNS name for the Postgres service. |
| **On the EC2 host** (migrations, `psql` to host port) | **`localhost`** — Postgres published on `5432` from `docker-compose.yml`. |
| **Amazon RDS** (if used later) | RDS **endpoint hostname**, e.g. `xxx.us-east-1.rds.amazonaws.com`. |

`jiu-tracker-nest/.env.example` defaults to `localhost` for local dev; Compose overrides with `DB_HOST: db` for the backend container.

---

## 12. Node.js on EC2 (migrations)

Migrations use `npm` / `ts-node` on the host. If `npm: command not found`:

**Amazon Linux 2023:**

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

**Ubuntu:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install from monorepo root: `npm install` (workspaces).

---

## 13. Running TypeORM migrations

From **monorepo root**, with env matching the **same** DB credentials as Docker Postgres:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=<same as POSTGRES_USER in .env>
export DB_PASSWORD='<same as DB_PASSWORD in .env>'
export DB_NAME=<postgres or jiu_tracker, per your .env>

npm run build -w @jiu-tracker/shared
npm run migration:run -w jiu-tracker-nest
```

**Typo:** script name is `migration:run`, not `migrtion:run`.

**If `password authentication failed`:** the shell did not load `DB_PASSWORD` from `.env`; export explicitly or `source` a shell-safe `.env`.

---

## 14. Migration failures we hit (and fixes)

### 14.1 `Cannot find module '@jiu-tracker/shared'`

Run from root with workspace build first: `npm run build -w @jiu-tracker/shared` then `npm run migration:run -w jiu-tracker-nest`.

### 14.2 `relation "training_session_submit_using_options" does not exist`

Migration `GeneratedMigration1771275865563` alters tables created by `TrainingSessionDurationNotesAndTechniqueOptions1739721600000`. That migration **returns early** if `training_sessions` does not exist (`getTable('training_sessions')` → no-op), but TypeORM still records it as executed. Later migrations then fail.

**Fresh DB with no base tables:** There is no single migration that creates all core tables (`users`, `techniques`, `training_sessions`) in every environment; you may need **one-time SQL** to create minimal schema, then re-run or continue migrations. See entity definitions under `jiu-tracker-nest/src/modules/**/domain/*.entity.ts`.

**`is_open_mat` already exists:** If you seeded columns manually that migration `1739721600000` also adds/renames, drop the conflicting column before re-run:

```bash
docker-compose exec db psql -U <user> -d <database> -c 'ALTER TABLE training_sessions DROP COLUMN IF EXISTS is_open_mat;'
```

### 14.3 `psql: command not found` on host

Use Postgres inside the container:

```bash
docker-compose exec db psql -U <DB_USERNAME> -d <DB_NAME> -c "\dt"
```

**Wrong path:** `/ect/nginx` → ** `/etc/nginx` ** (typo).

### 14.4 `role "postgres" does not exist`

Postgres user comes from `POSTGRES_USER` / `DB_USERNAME` in `.env`. Use `-U <that_user>` in `psql`, not `postgres` if you created a custom user.

### 14.5 `migrations` table empty on wrong database

`SELECT * FROM migrations` against database **`postgres`** vs app DB — use `-d` matching **`DB_NAME`** (e.g. `postgres` or `jiu_tracker`).

---

## 15. `@jiu-tracker/shared` and EAS Metro

**Error on EAS:** Metro cannot resolve `node_modules/@jiu-tracker/shared/dist/index.js` — `main` points to `dist/index.js` but `dist/` is not built on the build server.

**Fix:** In `packages/shared/package.json`, add:

```json
"scripts": {
  "prepare": "npm run build"
}
```

so `npm install` at monorepo root runs `tsc` and creates `dist/`. Commit **package-lock** changes if any.

---

## 16. EAS Android: Gradle / Expo

### 16.1 `expo-in-app-purchases`: `classifier` / `Jar` (Gradle 8)

Gradle 8 removed `classifier` on `Jar`; use `archiveClassifier.set("sources")`.

**Fix:** **patch-package** at monorepo root:

- `patches/expo-in-app-purchases+14.0.0.patch` patching `node_modules/expo-in-app-purchases/android/build.gradle`
- Root `package.json`: `"postinstall": "patch-package"` and devDependency `patch-package`

### 16.2 `expo-module-gradle-plugin` not found / `SoftwareComponent.release`

**Fix:** Pin EAS Android image for SDK 52 in `jiu-tracker-mobile/eas.json`:

```json
"android": {
  "image": "sdk-52"
}
```

on each profile used for Android builds.

### 16.3 General

- `npx expo install --fix` / `npx expo-doctor`
- `eas build -p android --profile <name> --clear-cache` when debugging

---

## 17. Nginx reverse proxy + HTTPS

**Why:** TLS termination, single public ports 80/443, no need to expose 3006 publicly long-term.

**Flow:** Client → `https://aws.jiutracker.com` → Nginx (443) → `http://127.0.0.1:3006` → Nest.

**Steps (summary):** Install Nginx + Certbot; add a `server` block for port 80 proxying to 3006; run `certbot --nginx -d aws.jiutracker.com`; verify `curl -i https://aws.jiutracker.com/health`.

**Detail:** `ai-docs/deploy/ec2-nginx-https.md` and `deploy/nginx-api.example.conf`.

**Example server_name:** `aws.jiutracker.com` (replace in config).

**Typo:** `touch /ect/nginx/...` → **`/etc/nginx/`**

---

## 18. DNS, Elastic IP, and “works by IP but not by hostname”

### 18.1 Elastic IP must be on **this** instance

- Allocate EIP → **Associate** to the EC2 instance running Nginx + Docker.
- If `curl http://169.254.169.254/latest/meta-data/public-ipv4` is empty, use the console **Public IPv4** / EIP association, or IMDSv2 token flow (AWS docs).

### 18.2 Route 53 A record: one target IP

- **Do not** leave two A record values (old + new IP). Clients may round-robin to a **dead** IP → timeouts.
- **Production hostname:** `aws.jiutracker.com` → **only** `100.50.84.168` (or current EIP).

### 18.3 Resolver mismatch

- **`nslookup aws.jiutracker.com 8.8.8.8`** → **100.50.84.168** (correct globally).
- Default **ISP resolver** may still return **54.232.226.196** for minutes (TTL/cache).
- **`curl https://aws.jiutracker.com/health`** times out while **`curl https://100.50.84.168/health`** works → DNS cache issue, not Nginx.

**Workarounds for local testing:**

```bash
curl -vk --resolve aws.jiutracker.com:443:100.50.84.168 https://aws.jiutracker.com/health
```

Or temporary `/etc/hosts` line: `100.50.84.168 aws.jiutracker.com`, or set system DNS to **8.8.8.8** / **1.1.1.1**.

### 18.4 `localhost` HTTPS works but public IP failed

Historically: DNS pointed to wrong IP or EIP not attached; after fixing A record + EIP, public HTTPS matches `localhost` behavior.

---

## 19. Mobile app environment

**File:** `jiu-tracker-mobile/.env` (local) and EAS profile `env` for production builds.

```env
EXPO_PUBLIC_API_URL=https://aws.jiutracker.com/api
```

Rebuild EAS after changing API URL. **No** `:3006` in the public URL.

---

## 20. CORS, mixed content, HTTPS

- **Mixed content:** HTTPS front-end calling **http://** API is blocked or restricted; use **https://** API URL.
- **CORS:** Nest uses `enableCors({ origin: true, credentials: true })`; for production, consider an explicit origin allowlist.

---

## 21. Files changed in the monorepo (reference)

| Item | Path |
|------|------|
| Shared prepare | `packages/shared/package.json` |
| Patch IAP + postinstall | Root `package.json`, `patches/expo-in-app-purchases+14.0.0.patch` |
| EAS Android image | `jiu-tracker-mobile/eas.json` |
| Backend Dockerfile CMD | `jiu-tracker-nest/Dockerfile` |
| Nginx guide | `ai-docs/deploy/ec2-nginx-https.md` |
| Nginx example | `deploy/nginx-api.example.conf` |
| This runbook | `ai-docs/deploy/jiu-tracker-ec2-eas-dns-runbook.md` |

---

## 22. Verification checklist

- [ ] EC2: `docker-compose ps` — `db`, `redis`, `rabbitmq`, `backend` healthy.
- [ ] EC2: `curl -s http://127.0.0.1:3006/health` → JSON `status: ok`.
- [ ] EIP associated to this instance; Route 53 A **only** current EIP.
- [ ] `nslookup aws.jiutracker.com 8.8.8.8` → current EIP.
- [ ] `curl -i https://aws.jiutracker.com/health` → 200 (after DNS cache catches up).
- [ ] `EXPO_PUBLIC_API_URL=https://aws.jiutracker.com/api` in app / EAS.
- [ ] EAS Android build succeeds (`sdk-52`, patches applied).

---

## 23. Session changelog (detailed)

| Topic | What happened |
|-------|----------------|
| AWS layout | Discussed ECS/RDS vs single EC2 + Compose; user chose EC2. |
| SSH | Security group “My IP” changed; fix inbound 22 for new IP. |
| Compose | `docker compose` vs `docker-compose`; install compose plugin / binary. |
| Buildx | Upgraded to ≥0.17 for `docker-compose build`. |
| npm on EC2 | Installed Node 20 via NodeSource for migrations. |
| DB_HOST | Explained `db` in Docker vs `localhost` on host. |
| Migrations | Password env; workspace + shared build; missing tables / `GeneratedMigration` / manual schema / `is_open_mat` conflict. |
| psql | Use `docker-compose exec db psql`; wrong user; wrong DB name. |
| Backend image | `dist/main.js` missing → use `dist/src/main.js` in Dockerfile. |
| Shared | `prepare` script for EAS Metro `dist/index.js`. |
| EAS Android | IAP Gradle `classifier` patch; `sdk-52` image; Gradle errors. |
| Nginx + HTTPS | Certbot, proxy to 3006, `aws.jiutracker.com`. |
| DNS / EIP | Dual A record confusion; ISP cache vs 8.8.8.8; `--resolve`; E2E curl success. |
| Docs | `ec2-nginx-https.md`, `deploy/nginx-api.example.conf`, this runbook. |

---

*Apply security hardening (CORS, SG rules, secrets rotation) per your organization. This document is operational context, not a compliance audit.*
