# Turtle Guide

Turtle Guide is a Next.js 13 (App Router) TypeScript web application for managing procedures, folders, and requests. It uses Prisma as the ORM with a generated client and a migrations history in `prisma/migrations`.

Key features

- Next.js 13 App Router with TypeScript
- Prisma ORM with generated client (see `src/generated/prisma`)
- Server and client code in `src/app`, including API routes under `src/app/api`
- Modular UI and components in `src/components` and `src/components/ui`
- Domain services, hooks, and API wrappers in `src/services`, `src/hooks`, and `src/lib`

Quick start

1. Install dependencies: `npm install`
2. Set `DATABASE_URL` in your environment
3. Run Prisma migrations and seed the database (example):

```
npx prisma migrate dev
node prisma/seed.ts
npm run dev
```

For more details, explore the project folders: `src/app`, `src/components`, `src/services`, and `prisma`.
