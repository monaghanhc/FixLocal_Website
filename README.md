# FixLocal AI

FixLocal AI is a free-to-run full-stack MVP for creating polished reports about local problems. Users can upload a photo, describe the issue and location, generate AI-assisted report text, see suggested contacts from a local mock directory, save the report, copy messages, open a mailto draft, download a PDF, and track status.

## Tech stack

- Next.js App Router with TypeScript
- Tailwind CSS
- SQLite with Prisma
- Demo cookie auth
- Local filesystem uploads in `public/uploads`
- Mock AI provider by default
- Optional OpenAI provider when `OPENAI_API_KEY` exists
- Client-side PDF generation with `jspdf`
- Mock/local contact suggestions

## Local setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app includes a `Continue as Demo User` flow. The default experience does not require paid APIs, cloud services, hosted databases, hosted file storage, email providers, maps APIs, or AI APIs.

## Environment

Copy `.env.example` to `.env` if needed. This repository includes a local `.env` for development convenience:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
```

Leave `OPENAI_API_KEY` unset or empty to use the free mock AI provider. If you add an OpenAI key, the app tries OpenAI first and falls back to mock AI on any provider error.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Prisma

The schema lives at `prisma/schema.prisma`.

Important models:

- `User`
- `Report`
- `SuggestedContact`
- `StatusHistory`

Seed data creates a demo user and realistic sample reports.

## Safety disclaimer

FixLocal AI does not provide legal advice. Users should review all AI-generated content before sending it. Contact suggestions are estimates and should be verified. For emergencies or immediate danger, call emergency services.
