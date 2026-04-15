# Task IN

Academic works platform built with Next.js 14, Prisma, PostgreSQL, MinIO, and NextAuth.

## Clone and run (new developer checklist)

### 1) Prerequisites

- Node.js 20+
- npm
- Docker Desktop

### 2) Clone project

```bash
git clone <REPO_URL>
cd akademportal
```

### 3) Create environment file

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4) Start infrastructure

```bash
docker compose up -d
```

This starts:

- PostgreSQL (`localhost:5432`)
- MinIO API (`localhost:9000`)
- MinIO Console (`localhost:9001`)
- Elasticsearch (`localhost:9200`, optional)

### 5) Install dependencies

```bash
npm install --legacy-peer-deps
```

### 6) Prepare database and storage

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run minio:init
```

Optional Elasticsearch indexing:

```bash
npm run es:index
```

### 7) Start app

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Default account (after seed)

- Admin: `admin@taskin.kz` / `admin123`

Students and supervisors are created via registration flow.  
Supervisor account must be approved by admin.

## `.env` essentials

Default local values:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskin
NEXTAUTH_SECRET=change-me-to-a-long-random-string
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
MINIO_BUCKET=academic-works

ELASTICSEARCH_URL=http://localhost:9200
```

## Useful scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run db:generate` - generate Prisma client
- `npm run db:push` - apply schema to database
- `npm run db:seed` - seed base data
- `npm run minio:init` - create/check MinIO bucket
- `npm run es:index` - index approved works into Elasticsearch
- `npm run setup` - `db:push + db:seed + es:index + minio:init`

## Quick troubleshooting

### `EPERM` on Prisma generate (Windows)

If `query_engine-windows.dll.node` is locked:

1. stop running dev server / Node processes
2. close terminals that may lock Prisma files
3. run `npm run db:generate` again

### Upload fails

Usually MinIO is not running or bucket is missing:

```bash
docker compose ps
npm run minio:init
```

### Reset local database

```bash
npx prisma db push --force-reset --accept-data-loss
npm run db:seed
```

## Production deploy

Full production guide is in `DEPLOYMENT.md`.

Important: local `localhost` MinIO does not work for production hosting.  
Use hosted MinIO/S3 endpoint and set production env variables accordingly.
