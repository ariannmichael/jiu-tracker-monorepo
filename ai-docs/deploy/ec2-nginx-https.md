# EC2: Nginx reverse proxy + HTTPS for Jiu Tracker API

Use this when the Nest API runs in Docker on the same EC2 (e.g. `docker-compose` publishing port **3006**). Nginx terminates TLS and forwards to `http://127.0.0.1:3006`.

## Prerequisites

1. **Domain** (e.g. `api.yourdomain.com`) with an **A record** pointing to your EC2 **public IP** (or Elastic IP).
2. **Security group**: inbound **TCP 80** and **443** from `0.0.0.0/0` (or restrict later). Keep **22** for SSH and **3006** only if you still need direct HTTP access (optional once HTTPS works).
3. **Backend** reachable on the host: `curl -s http://127.0.0.1:3006/health` should work while containers are up.

## 1. Install Nginx

**Amazon Linux 2023**

```bash
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

**Ubuntu 22.04+**

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## 2. Install Certbot (Let’s Encrypt)

**Amazon Linux 2023**

```bash
sudo yum install -y certbot python3-certbot-nginx
```

**Ubuntu**

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## 3. Add Nginx site (HTTP first)

Replace `api.example.com` with your real hostname.

```bash
sudo tee /etc/nginx/conf.d/jiu-tracker-api.conf <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Large JSON bodies (avatars, etc.) — match Nest body limit
        client_max_body_size 10m;
    }
}
EOF
```

Edit the file if needed:

```bash
sudo nano /etc/nginx/conf.d/jiu-tracker-api.conf
```

Test and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Check from your laptop: `http://api.example.com/health` (should proxy to the API).

## 4. Obtain HTTPS certificate

```bash
sudo certbot --nginx -d api.example.com
```

Follow prompts (email, agree to terms). Certbot will adjust the Nginx config for **443** and renewals.

Verify:

```bash
curl -sS https://api.example.com/health
```

## 5. Auto-renewal

Certbot installs a timer/cron. Test renewal:

```bash
sudo certbot renew --dry-run
```

## 6. Point the mobile app at HTTPS

Set:

```env
EXPO_PUBLIC_API_URL=https://api.example.com/api
```

Rebuild the app (EAS or local) so the URL is baked in.

## 7. Optional: lock down CORS in production

In `jiu-tracker-nest` `main.ts`, replace `origin: true` with an allowlist of origins (your app scheme, web origins) when you are ready.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| 502 Bad Gateway | `docker-compose ps`, `curl http://127.0.0.1:3006/health` |
| Certificate fails | DNS A record must point to this server; port 80 open |
| Too large body | Increase `client_max_body_size` in the `location` block |
| Mixed content in browser | Frontend must call `https://` API, not `http://` |

## Repo template

See `deploy/nginx-api.example.conf` in the monorepo for the same server block (replace `api.example.com`).
