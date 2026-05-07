# Task IN

Task IN — академиялық жұмыстарды басқаруға арналған веб-платформа.  
Технологиялар: Next.js 14, Prisma, PostgreSQL, NextAuth (қосымша Elasticsearch).

## Жобаны нөлден іске қосу (қадам-қадаммен)

### 1-қадам. Қажетті бағдарламалар

Компьютерде мыналар орнатулы болсын:

- Node.js 20+
- npm
- Docker Desktop

### 2-қадам. Репозиторийді көшіру

```bash
git clone <REPO_URL>
cd akademportal
```

### 3-қадам. `.env` файлын жасау

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4-қадам. Инфрақұрылымды көтеру (Docker)

```bash
docker compose up -d
```

Осы команда мына сервистерді іске қосады:

- PostgreSQL (`localhost:5432`)
- Elasticsearch (`localhost:9200`, міндетті емес)

Контейнерлердің статусын тексеру:

```bash
docker compose ps
```

### 5-қадам. Тәуелділіктерді орнату

```bash
npm install --legacy-peer-deps
```

### 6-қадам. Дерекқор және сақтау орнын дайындау

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Егер Elasticsearch индекстеу керек болса:

```bash
npm run es:index
```

### 7-қадам. Жобаны іске қосу

```bash
npm run dev
```

Браузерде ашыңыз: [http://localhost:3000](http://localhost:3000)

## Seed-тен кейінгі бастапқы аккаунт

- Әкімші: `admin@taskin.kz` / `admin123`

Ескерту:

- Студент пен жетекші аккаунттары тіркелу арқылы жасалады.
- Жетекші аккаунтын әкімші бекітуі керек.

## `.env` ішіндегі негізгі айнымалылар

Жергілікті орта үшін әдепкі мәндер:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskin
NEXTAUTH_SECRET=change-me-to-a-long-random-string
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=

ELASTICSEARCH_URL=http://localhost:9200
```

## Пайдалы командалар

- `npm run dev` - development серверді іске қосу
- `npm run build` - production build жасау
- `npm run db:generate` - Prisma client генерациялау
- `npm run db:push` - схема өзгерістерін базаға қолдану
- `npm run db:seed` - бастапқы деректерді толтыру
- `npm run es:index` - Elasticsearch-ке индекстеу
- `npm run setup` - `db:push + db:seed + es:index`

## Жиі кездесетін мәселелер

### 1) Windows-та `EPERM` (Prisma generate)

Егер `query_engine-windows.dll.node` lock болса:

1. `npm run dev` және басқа Node процестерін тоқтатыңыз
2. Prisma файлдарын ұстап тұрған терминалдарды жабыңыз
3. Қайтадан іске қосыңыз:

```bash
npm run db:generate
```

### 2) Файл жүктеу істемейді

Бұл нұсқада файлдар PostgreSQL-ге тікелей сақталады. Әдетте мәселе:

- Дерекқор қосылмаған
- Дерекқорда орын/лимит жетпеген
- `prisma db push` жасалмаған

### 3) Жергілікті дерекқорды толық тазалап қайта бастау

```bash
npx prisma db push --force-reset --accept-data-loss
npm run db:seed
```

## Production-ға шығару

Толық deploy нұсқаулық: `DEPLOYMENT.md`.

Маңызды:

- Бұл нұсқада файлдар да PostgreSQL ішінде сақталады (`bytea`/`Bytes`).
- Production-та үлкен файл ағындары болса, бөлек object storage (S3/MinIO) қарастыру ұсынылады.
