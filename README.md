# ReportRight AI

Live hosted demo:
[https://monaghanhc.github.io/FixLocal_Website/](https://monaghanhc.github.io/FixLocal_Website/)

ReportRight AI is the public-facing name for the existing FixLocal MVP codebase. The repo and package names are preserved to avoid unnecessary deployment churn.

The app helps users upload a photo, confirm the location/category, route the issue to likely recipients, generate professional report text, review recipient confidence, and save/copy/export the result.

## Tech stack

- Next.js App Router with TypeScript
- Tailwind CSS
- SQLite with Prisma
- Demo cookie auth
- Local filesystem uploads in `public/uploads`
- Mock AI provider by default
- Optional OpenAI provider when `OPENAI_API_KEY` exists
- Client-side PDF generation with `jspdf`
- Contact routing service with confidence, explanations, and recipient verification
- Billing/entitlement service stubs for freemium and Pro plans

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

## Hosted demo

The public GitHub Pages demo is available at:

[https://monaghanhc.github.io/FixLocal_Website/](https://monaghanhc.github.io/FixLocal_Website/)

GitHub Pages is static-only, so the hosted demo in `docs/` uses browser localStorage, browser image previews, mock AI, copy/mailto actions, contact verification guidance, and client-side PDF generation. The full Next.js/Prisma/SQLite implementation remains the local app described above.

## Contact routing

`src/lib/contact-routing/service.ts` implements `ContactRoutingService`.

Inputs include image classification, user-confirmed category, notes, GPS/address fields, city, county, state, and ZIP code. The service returns:

- `suggestedContacts`
- `confidenceScore`
- `explanation`
- `fallbackWarnings`
- `manualReviewRequired`
- `emergencyWarningRequired`

Confidence rules:

- High: exact jurisdiction + exact category + verified source.
- Medium: jurisdiction match + general department match.
- Low: only category match, incomplete location, or missing/stale source.

Low-confidence routing requires manual review before saving/sending. Contact suggestions do not display fake phone numbers or emails as real data; they use official-source lookup links unless a curated verified source exists.

## Billing and entitlements

Free plan:

- 3 AI-generated reports per calendar month.
- Basic report generation.
- Manual recipient confirmation required.

Pro plans:

- Monthly Pro: `$4.99/month`
- Annual Pro: `$29.99/year`
- Unlimited reports, PDF export, report history, saved contacts, and follow-up workflow support.

`src/lib/billing/billingService.ts` keeps Stripe behind a clean stub. `src/lib/billing/entitlementService.ts` enforces local usage limits and demo Pro entitlement behavior. Web Stripe users should manage billing through the Stripe customer portal. iOS users manage subscriptions through Apple account subscriptions. Android users manage subscriptions through Google Play subscriptions.

## Environment

Copy `.env.example` to `.env` if needed:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
STRIPE_SECRET_KEY=""
```

Leave `OPENAI_API_KEY` unset or empty to use the free mock AI provider. If you add an OpenAI key, the app tries OpenAI first and falls back to mock AI on any provider error.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Prisma

The schema lives at `prisma/schema.prisma`.

Important models include:

- `User`
- `Report`
- `UploadedImage`
- `IssueCategory`
- `Jurisdiction`
- `Contact`
- `ContactSource`
- `RoutingDecision`
- `SubscriptionPlan`
- `UserEntitlement`
- `UsageCounter`
- `SuggestedContact`
- `StatusHistory`

Seed data creates a demo user, sample reports, issue categories, and Pro plan records.

## Safety disclaimer

ReportRight AI does not provide legal advice. AI-generated reports may be inaccurate and must be reviewed before sending. Users are responsible for verifying recipients and report details. For emergencies or immediate danger, call emergency services. ReportRight AI is not affiliated with any government agency unless explicitly stated.
