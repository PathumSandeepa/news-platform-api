# News Platform API

A RESTful news platform API built with **NestJS 11**, **Prisma 7**, **TypeScript**, and **PostgreSQL** (Supabase). Features JWT authentication, role-based access control (ADMIN, EDITOR, READER), article CRUD with filtering/sorting/pagination, hCaptcha verification, and Swagger API documentation. This is the backend for the [News Platform UI](https://github.com/PathumSandeepa/news-platform-ui) (Next.js frontend).

**Live API:** https://news-platform-api-do7e.onrender.com

**Swagger Docs:** https://news-platform-api-do7e.onrender.com/api/docs

> **Note:** The live API is hosted on Render's free tier. The service spins down after periods of inactivity. The first request after inactivity may take 30-60 seconds while the server cold-starts.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Role-Based Access Control](#role-based-access-control)
- [Seeded Credentials](#seeded-credentials)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)

---

## Features

- **JWT Authentication** - Register and login with hashed passwords and JWT token-based sessions
- **Role-Based Access Control** - Three roles (ADMIN, EDITOR, READER) with granular route-level permissions
- **Article CRUD** - Create, read, update, and delete articles with category filtering, sorting, and pagination
- **hCaptcha Verification** - Bot protection on registration and login endpoints (skippable in development)
- **Swagger Documentation** - Interactive API docs auto-generated from decorators at `/api/docs`
- **Database Seeding** - Pre-configured seed scripts for users and sample articles
- **View and Like Tracking** - Increment article views on read and likes via dedicated endpoint
- **Health Check** - `/health` endpoint with database connectivity status
- **CORS Configuration** - Configurable allowed origins for frontend integration
- **Input Validation** - Request validation using `class-validator` with whitelist and transform pipes
- **CI/CD Pipeline** - GitHub Actions workflow for linting and build verification on every push

---

## Tech Stack

| Technology                                           | Version | Purpose                                  |
| ---------------------------------------------------- | ------- | ---------------------------------------- |
| [NestJS](https://nestjs.com/)                        | 11.x    | Node.js framework for scalable APIs      |
| [TypeScript](https://www.typescriptlang.org/)        | 5.x     | Static type checking                     |
| [Prisma](https://www.prisma.io/)                     | 7.4.2   | ORM for database access and migrations   |
| [PostgreSQL](https://www.postgresql.org/)            | —       | Relational database (hosted on Supabase) |
| [JWT](https://github.com/nestjs/jwt)                 | 11.x    | Token-based authentication               |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 6.x     | Password hashing                         |
| [hCaptcha](https://www.hcaptcha.com/)                | —       | Bot protection via `@nestjs/axios`       |
| [Swagger](https://github.com/nestjs/swagger)         | 11.x    | Auto-generated API documentation         |
| [Docker](https://www.docker.com/)                    | —       | Local PostgreSQL development environment |
| [pnpm](https://pnpm.io/)                             | latest  | Package manager                          |

---

## Project Structure

```
news-platform-api/
├── src/
│   ├── app.module.ts                          # Root application module
│   ├── app.controller.ts                      # Root controller
│   ├── app.service.ts                         # Root service
│   ├── app.controller.spec.ts                 # Root controller unit test
│   ├── main.ts                                # Application bootstrap (CORS, Swagger, validation)
│   ├── prisma/
│   │   ├── prisma.service.ts                  # Prisma client service
│   │   └── prisma.module.ts                   # Prisma module (global)
│   ├── auth/
│   │   ├── auth.controller.ts                 # Login and registration endpoints
│   │   ├── auth.service.ts                    # Authentication logic (JWT, bcrypt)
│   │   ├── auth.module.ts                     # Auth module
│   │   ├── jwt.strategy.ts                    # Passport JWT strategy
│   │   ├── captcha.service.ts                 # hCaptcha verification service
│   │   └── dto/                               # Login, register, and response DTOs
│   ├── articles/
│   │   ├── articles.controller.ts             # Article CRUD endpoints
│   │   ├── articles.service.ts                # Article business logic
│   │   ├── articles.module.ts                 # Articles module
│   │   └── dto/                               # Create and update article DTOs
│   ├── users/
│   │   ├── users.controller.ts                # User management endpoints
│   │   ├── users.service.ts                   # User business logic
│   │   └── users.module.ts                    # Users module
│   ├── health/
│   │   ├── health.controller.ts               # Health check endpoint
│   │   ├── health.controller.spec.ts          # Health controller unit test
│   │   └── health.module.ts                   # Health module
│   └── common/
│       ├── guards/
│       │   ├── jwt-auth.guard.ts              # JWT authentication guard
│       │   └── roles.guard.ts                 # Role-based authorization guard
│       ├── decorators/
│       │   └── roles.decorator.ts             # @Roles() decorator
│       ├── constants/
│       │   └── app.constants.ts               # Application constants
│       └── types/
│           └── request-with-user.interface.ts  # Typed Express request interface
├── prisma/
│   ├── schema.prisma                          # Database schema (User, Article, Role, Category)
│   ├── seed.ts                                # Seed entry point
│   └── seeders/
│       ├── user.seeder.ts                     # Seed admin, editor, and reader users
│       └── article.seeder.ts                  # Seed sample articles
├── .github/
│   └── workflows/
│       └── main.yml                           # CI pipeline (lint + build)
├── prisma.config.ts                           # Prisma configuration
├── docker-compose.yml                         # Local PostgreSQL container
├── package.json                               # Dependencies and scripts
├── pnpm-lock.yaml                             # pnpm lockfile
└── tsconfig.json                              # TypeScript compiler configuration
```

---

## Prerequisites

- **Node.js** >= 18.x
- **pnpm** (recommended package manager) — Install with `npm install -g pnpm`
- **Docker** (for local PostgreSQL) OR a **Supabase** account for cloud database
- **Next.js frontend** running locally or accessible remotely. See [news-platform-ui](https://github.com/PathumSandeepa/news-platform-ui)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PathumSandeepa/news-platform-api.git
cd news-platform-api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create the environment file

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

See the [Environment Variables](#environment-variables) section for details on each variable.

### 4. Start the database

**Option A: Local Docker PostgreSQL**

```bash
docker-compose up -d
```

This starts a PostgreSQL container on port `5432` with the credentials defined in `docker-compose.yml`.

**Option B: Supabase (Cloud)**

Create a project on [Supabase](https://supabase.com/) and copy the **session pooler** connection string into `DATABASE_URL` in your `.env` file.

### 5. Sync the database schema

```bash
npx prisma db push
```

### 6. Seed the database

```bash
npx prisma db seed
```

This creates three users (admin, editor, reader) and sample articles. See [Seeded Credentials](#seeded-credentials).

### 7. Start the development server

```bash
pnpm start:dev
```

The API runs on [http://localhost:8000](http://localhost:8000) by default. Swagger docs are available at [http://localhost:8000/api/docs](http://localhost:8000/api/docs).

---

## Environment Variables

| Variable               | Required | Default | Description                                                        |
| ---------------------- | -------- | ------- | ------------------------------------------------------------------ |
| `DATABASE_URL`         | Yes      | —       | PostgreSQL connection string (Supabase pooler or local Docker)     |
| `PORT`                 | No       | `8000`  | Port the application listens on                                    |
| `FRONTEND_URL`         | Yes      | —       | Allowed CORS origin (e.g. `http://localhost:3000`)                 |
| `JWT_SECRET`           | Yes      | —       | Secret key for signing JWT tokens                                  |
| `JWT_EXPIRES_IN`       | No       | `7d`    | JWT token expiry duration                                          |
| `HCAPTCHA_SECRET`      | Yes      | —       | hCaptcha secret key (use test key `0x0000...0000` for local)       |
| `HCAPTCHA_SITE_KEY`    | Yes      | —       | hCaptcha site key (use test key `10000000-ffff-...0001` for local) |
| `HCAPTCHA_SKIP_VERIFY` | No       | `false` | Set `true` to skip CAPTCHA verification in local development       |

Create a `.env` file in the project root (this file is gitignored):

```env
DATABASE_URL="postgresql://user:user1234@localhost:5432/newsplatform"
PORT=8000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-very-long-random-secret-key-change-this
JWT_EXPIRES_IN=7d
HCAPTCHA_SECRET=0x0000000000000000000000000000000000000000
HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
HCAPTCHA_SKIP_VERIFY=true
```

For production, use real hCaptcha keys and set `HCAPTCHA_SKIP_VERIFY=false`.

---

## Available Scripts

| Command            | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `pnpm start:dev`   | Start the development server with hot reload                |
| `pnpm start:debug` | Start in debug mode with hot reload                         |
| `pnpm build`       | Production build (runs `prisma generate` then `nest build`) |
| `pnpm start:prod`  | Run the production build from `dist/`                       |
| `pnpm lint`        | Run ESLint to check and fix code quality issues             |
| `pnpm format`      | Format code with Prettier                                   |
| `pnpm test`        | Run unit tests with Jest                                    |
| `pnpm test:watch`  | Run tests in watch mode                                     |
| `pnpm test:cov`    | Run tests with coverage report                              |
| `pnpm test:e2e`    | Run end-to-end tests                                        |

---

## Database Schema

The application uses two main models with enum types:

**User**

- `id` (UUID), `username` (unique), `email` (unique), `password` (hashed), `role` (ADMIN / EDITOR / READER), `createdAt`

**Article**

- `id` (UUID), `title`, `slug` (unique), `content`, `coverImage` (optional URL), `category` (SPORTS / BUSINESS / ENTERTAINMENT / TECHNOLOGY / POLITICS / HEALTH), `views`, `likes`, `published`, `publishedAt`, `createdAt`, `updatedAt`, `authorId` (FK → User)

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description                                  |
| ------ | ---------------- | -------------------------------------------- |
| POST   | `/auth/register` | Register a new user (with optional hCaptcha) |
| POST   | `/auth/login`    | Login and receive a JWT token                |

### Articles (Authenticated)

| Method | Endpoint             | Description                                                                                                     |
| ------ | -------------------- | --------------------------------------------------------------------------------------------------------------- |
| GET    | `/articles`          | List articles (query: `sortBy`, `category`, `page`, `limit`). READER sees published only; ADMIN/EDITOR see all. |
| GET    | `/articles/:id`      | Get article by ID (increments view count)                                                                       |
| POST   | `/articles`          | Create a new article (ADMIN, EDITOR only)                                                                       |
| PATCH  | `/articles/:id`      | Update an article (ADMIN, EDITOR only)                                                                          |
| DELETE | `/articles/:id`      | Delete an article (ADMIN only)                                                                                  |
| POST   | `/articles/:id/like` | Like an article                                                                                                 |

### Users (ADMIN Only)

| Method | Endpoint          | Description                                             |
| ------ | ----------------- | ------------------------------------------------------- |
| GET    | `/users`          | List all users                                          |
| PATCH  | `/users/:id/role` | Update a user's role (cannot demote self or last admin) |

### Health

| Method | Endpoint  | Description                       |
| ------ | --------- | --------------------------------- |
| GET    | `/health` | Health check with database status |

---

## Role-Based Access Control

| Role     | Permissions                                                 |
| -------- | ----------------------------------------------------------- |
| `READER` | Read published articles, like articles                      |
| `EDITOR` | All READER permissions + create and edit articles           |
| `ADMIN`  | All EDITOR permissions + delete articles, manage user roles |

---

## Seeded Credentials

After running `npx prisma db seed`, the following test accounts are available:

| Email                     | Password     | Role   |
| ------------------------- | ------------ | ------ |
| `admin@newsplatform.com`  | `Admin@123`  | ADMIN  |
| `editor@newsplatform.com` | `Editor@123` | EDITOR |
| `reader@newsplatform.com` | `Reader@123` | READER |

---

## CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration.

- **File:** `.github/workflows/main.yml`
- **Trigger:** Push and pull request to `main` branch
- **Jobs:**
  1. **lint** — Checkout → Node 22 → pnpm install → Prisma generate → `pnpm lint`
  2. **build** — (needs lint) Checkout → Node 22 → pnpm install → Prisma generate → `pnpm build`

This ensures code quality and a successful build on every push to `main`.

---

## Deployment

### Backend — Render

The NestJS API is deployed on [Render](https://render.com/) as a free tier Web Service:

1. **Import the GitHub repository** into Render: [github.com/PathumSandeepa/news-platform-api](https://github.com/PathumSandeepa/news-platform-api)
2. Configure the service:
   - **Build command:** `pnpm install --frozen-lockfile && pnpm run build`
   - **Start command:** `pnpm run start:prod`
3. **Set environment variables** in Render's dashboard (see [Environment Variables](#environment-variables)).
4. Deployment is connected to the `main` branch with automatic redeployment on every push.

**Production URL:** https://news-platform-api-do7e.onrender.com

### Database — Supabase

- **Provider:** [Supabase](https://supabase.com/) PostgreSQL
- **Region:** South Asia — Mumbai (`ap-south-1`)
- Use the **session pooler** connection string for IPv4 compatibility.

### Frontend — Separate Repository

The frontend is a Next.js application deployed on Vercel:

- **Repository:** [github.com/PathumSandeepa/news-platform-ui](https://github.com/PathumSandeepa/news-platform-ui)

### Environment Setup Summary

| Environment         | `DATABASE_URL`                                           | Notes                              |
| ------------------- | -------------------------------------------------------- | ---------------------------------- |
| Local Development   | `postgresql://user:user1234@localhost:5432/newsplatform` | Requires Docker PostgreSQL running |
| Production (Render) | Supabase session pooler URL                              | Set in Render dashboard            |

---

## Known Limitations

- **No token blacklisting** — Logout is handled on the frontend only; JWT tokens remain valid until expiry.
- **No per-user like tracking** — Likes are not deduplicated; a user can like an article multiple times.
- **No view deduplication** — Every `GET /articles/:id` request increments the view counter.
- **No full-text search** — Article filtering is limited to category and sorting.
- **No email verification or password reset** — Registration does not require email confirmation.
- **coverImage is a URL string** — No file upload; images are referenced by external URL.
- **No pagination on GET `/users`** — The users endpoint returns all users without pagination.

---

## Troubleshooting

| Issue                                | Solution                                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Build fails on Render**            | `prisma generate` must run before `nest build` — this is already handled in the `build` script in `package.json`.           |
| **CORS errors**                      | Set `FRONTEND_URL` to your exact frontend origin in Render environment variables (e.g. `https://your-frontend.vercel.app`). |
| **Database connection fails**        | Check `DATABASE_URL` format. Supabase requires the **session pooler** URL for IPv4 networks.                                |
| **Login always fails in production** | Ensure `HCAPTCHA_SKIP_VERIFY=false` and real hCaptcha keys are configured in production environment variables.              |
| **`pnpm: command not found`**        | Install pnpm globally: `npm install -g pnpm`                                                                                |
| **Port 8000 already in use**         | Stop the other process or change the `PORT` value in `.env`.                                                                |
| **Prisma client not generated**      | Run `npx prisma generate` manually, or use `pnpm build` which runs it automatically.                                        |

---

## License

This project is for educational and demonstration purposes.
