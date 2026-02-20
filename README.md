# Execution Blueprint MVP

The startup for startups.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma ORM
- NextAuth credentials authentication

## Quick Start
1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## MVP Features
- Email/password auth (signup/login)
- Dashboard with credit tracking, submission history, and statuses
- 20-question structured idea submission form
- Server-side scoring engine (6 pillars + risk tier)
- Results view with pillar bars and pivot suggestions
- Paid plan upgrade page (payment placeholder)
- Admin panel for status updates, notes, and report URL placeholder
- Credit system (free: 1, paid: 5)
