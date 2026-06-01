# Deployment Guide

## Architecture

```text
Vercel
   │
   ▼
Next.js Frontend

Render
   │
   ▼
NestJS API

Managed PostgreSQL
   │
   ▼
Database
```

---

# Environment Variables

## API

```env
DATABASE_URL=
JWT_SECRET=
```

## Web

```env
NEXT_PUBLIC_API_URL=
```

---

# Local Development

## Start Infrastructure

```bash
docker compose up -d
```

Services:

* PostgreSQL 16
* Redis 7

---

## Install Dependencies

```bash
pnpm install
```

---

## Run Development

```bash
pnpm dev
```

---

# Build

```bash
pnpm build
```

---

# Production Deployment

## Frontend

Deploy:

```text
Vercel
```

Build Command:

```bash
pnpm build
```

---

## Backend

Deploy:

```text
Render
```

Build Command:

```bash
pnpm build
```

Start Command:

```bash
pnpm start:prod
```

---

# Database Migrations

Generate Migration:

```bash
npx prisma migrate dev
```

Deploy Migration:

```bash
npx prisma migrate deploy
```

Generate Client:

```bash
npx prisma generate
```
