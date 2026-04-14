# Task IN Deployment (Local + Vercel + Render)

Бұл нұсқаулық жобаны:
- локалда (`localhost`)
- интернетте (`Vercel` немесе `Render`)
бір кодбазамен жүргізуге арналған.

---

## 0) Міндетті дайындық

1. Репозиторий GitHub-қа push жасалған болуы керек.
2. PostgreSQL дерекқоры дайын болуы керек (Neon/Supabase/Render Postgres және т.б.).
3. MinIO/S3 bucket дайын болуы керек (жоба файл жүктеу үшін қажет).
4. `NEXTAUTH_SECRET` үшін ұзын, кездейсоқ мән дайындаңыз.

---

## 1) Local + Hosting бірге жұмыс істеу логикасы

Жоба екі ортада да жұмыс істеуі үшін env айнымалылар **ортаға бөлек** беріледі:

- **Локал**: `akademportal/.env` (немесе `.env.local`)
- **Vercel**: Project Settings -> Environment Variables
- **Render**: Service -> Environment

### Неге бөлек?

`NEXTAUTH_URL` әр ортада әртүрлі:
- локал: `http://localhost:3000`
- Vercel: `https://your-project.vercel.app`
- Render: `https://your-service.onrender.com`

Сондықтан бір файлды көшіріп жүрудің орнына, әр платформада өз env қолданған дұрыс.

---

## 2) Environment Variables

Екі платформада да мына env айнымалыларын орнатыңыз:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
JWT_SECRET=

MINIO_ENDPOINT=
MINIO_PORT=
MINIO_USE_SSL=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=

ELASTICSEARCH_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

ITHENTICATE_API_KEY=
ITHENTICATE_API_URL=
```

### Маңызды

- `NEXTAUTH_URL` міндетті түрде нақты домен болуы керек:
  - Local: `http://localhost:3000`
  - Vercel: `https://your-project.vercel.app`
  - Render: `https://your-service.onrender.com`
- `DATABASE_URL` сыртқы managed PostgreSQL болғаны дұрыс.
- `ELASTICSEARCH_URL` орнатылмаса, іздеу PostgreSQL fallback режимінде жұмыс істейді.

---

## 3) Локалда іске қосу (Local Development)

`akademportal` ішінде:

```bash
npm install --legacy-peer-deps
npm run db:generate
npm run db:push
npm run db:seed
npm run minio:init
npm run dev
```

Ашу: `http://localhost:3000`

Егер Elasticsearch жоқ болса да жоба жұмыс істейді (fallback бар).

---

## 4) Vercel-ге шығару

Жоба түбірінде `vercel.json` дайын тұр.

### Қадамдар

1. [Vercel](https://vercel.com/) ішінде **New Project** таңдаңыз.
2. GitHub репозиторийін импорттаңыз.
3. Framework: `Next.js` (автоматты анықталады).
4. Environment Variables бөліміне жоғарыдағы айнымалыларды енгізіңіз.
5. Deploy жасаңыз.

### Build/Install баптауы

`vercel.json`:
- `installCommand`: `npm install --legacy-peer-deps`
- `buildCommand`: `npm run build`

### Deploy-тен кейін

1. `NEXTAUTH_URL` мәнін нақты Vercel доменіне қойыңыз.
2. Қайта deploy/redeploy орындаңыз.
3. Бір рет Prisma schema push/seed қажет болса, локалда орындап дерекқорға қолданасыз:

```bash
npm run db:push
npm run db:seed
```

> Ескерту: production-да `db:seed` тек бастапқы дерек керек болса ғана орындалады.

---

## 5) Render-ге шығару

Жоба түбірінде `render.yaml` дайын тұр.

### Қадамдар (Blueprint арқылы)

1. [Render Dashboard](https://dashboard.render.com/) ашыңыз.
2. **New +** -> **Blueprint** таңдаңыз.
3. Репозиторийді көрсетіңіз (ішінде `render.yaml` бар).
4. Service параметрлері автоматты оқылады.
5. Environment Variables мәндерін Render ішінде толтырыңыз.
6. Deploy орындаңыз.

### render.yaml негізгі баптауы

- Runtime: Node
- Build: `npm install --legacy-peer-deps && npm run db:generate && npm run build`
- Start: `npm run start`
- Health check: `/`

### Deploy-тен кейін

1. `NEXTAUTH_URL` = Render web service URL
2. DB бос болса, локалдан немесе Render shell арқылы бір рет:

```bash
npm run db:push
npm run db:seed
```

3. MinIO bucket әлі жоқ болса:

```bash
npm run minio:init
```

---

## 6) Міндетті тексерістер (post-deploy)

1. `/` және `/auth` ашылады
2. Тіркелу/кіру жұмыс істейді
3. Admin логин (`admin@taskin.kz / admin123`) жұмыс істейді (seed орындалса)
4. Файл upload қате бермейді (MinIO дұрыс қосылған)
5. Іздеу жұмыс істейді (Elasticsearch бар немесе SQL fallback)
6. Role-based беттерге рұқсат дұрыс бөлінеді

---

## 7) Жиі кездесетін қателер

### `Unauthorized` немесе auth redirect loop
- `NEXTAUTH_URL` дұрыс емес
- `NEXTAUTH_SECRET` қойылмаған/өзгерген

### Upload 503 (MinIO/S3)
- `MINIO_*` параметрлері қате
- Bucket жасалмаған (`npm run minio:init`)

### Prisma байланыс қатесі
- `DATABASE_URL` қате
- IP allowlist/SSL баптауы дұрыс емес

### Elasticsearch жоқ
- Бұл қалыпты, себебі fallback бар
- Іздеу сапасын арттыру үшін `ELASTICSEARCH_URL` орнатыңыз
