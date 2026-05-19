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

## Contact routing workflow

`src/lib/contact-routing/service.ts` implements `ContactRoutingService`.

Inputs include image classification, user-confirmed category, notes, GPS/address fields, city, county, state, ZIP code, and an optional manually entered recipient. The service returns:

- `suggestedContacts`
- `confidenceScore`
- `confidenceLabel`
- `issueCategory`
- `likelyJurisdiction`
- `explanation`
- `fallbackWarnings`
- `manualReviewRequired`
- `emergencyWarningRequired`

The core flow is:

1. Upload/capture an image.
2. Enter notes and provide GPS or manual address details.
3. The AI provider classifies the issue from notes/category/photo context.
4. The user can confirm or edit the category before routing.
5. GPS can be reverse-geocoded client-side with OpenStreetMap Nominatim; users must verify the resulting address.
6. The routing service determines likely city/county/state jurisdiction from the provided fields.
7. Category + jurisdiction are matched to 1-3 candidate recipients.
8. The UI explains the recommendation, confidence, source, and last verified date.
9. Users must verify a suggested contact or manually enter a recipient before generated messages can be viewed/copied/mailed/saved.

Routing category mapping:

- `Pothole` -> Public Works, streets department, county DOT, state DOT
- `Broken sidewalk` -> Public Works, code enforcement
- `Broken streetlight` -> utility company, Public Works
- `Trash or illegal dumping` -> sanitation, code enforcement
- `Drainage or flooding` -> stormwater, Public Works
- `Mold` -> landlord/property manager, housing authority, code enforcement
- `Unsafe rental condition` -> landlord/property manager, housing authority, code enforcement
- `Unsafe building` -> code enforcement, building inspections
- `Downed tree` -> Public Works, parks department, emergency services if urgent
- `Power line or utility hazard` -> utility company, emergency services if urgent
- `Water leak` -> water department, utility company
- `HOA issue` -> HOA contact or property manager
- `Other local problem` -> manual review

Confidence rules:

- High: exact jurisdiction + exact category + verified, non-stale source.
- Medium: jurisdiction match + general department match + verified, non-stale source that is not category-specific.
- Low: sample data, no verified contact, broad category only, stale/missing source, incomplete location, or uncertain jurisdiction.

Low-confidence routing requires manual review before saving/sending. Contact suggestions do not display fake phone numbers or emails as real data; they use official-source lookup links unless a curated verified source exists.

Emergency warning logic is triggered when the user marks the issue urgent, when the category is `Power line or utility hazard`, or when notes/classification contain signals such as `sparking`, `downed wire`, `gas smell`, `collapse`, `injury`, or `immediate danger`.

## Contact data structure

The local MVP uses two complementary contact data layers:

- `src/lib/contact-routing/verifiedDirectory.ts` is a small in-code starter directory used by the routing service and unit tests.
- Prisma models `Jurisdiction`, `ContactSource`, and `Contact` hold seeded contact data for local development.

Each routed contact includes:

- `name`
- `organization`
- `department`
- `type`
- `email`
- `phone`
- `website`
- `source`
- `sourceLastVerifiedAt`
- `reasonForRecommendation`
- `confidence`

The starter directory supports `sourceKind`:

- `verified-exact`: exact category and exact jurisdiction from an official source.
- `verified-general`: official jurisdiction/department source, but not exact to the issue type.
- `sample`: local development data only. These records are always low confidence and must not be presented as verified.

Seeded sample jurisdictions:

- Mount Pleasant, SC
- Charleston, SC
- Charleston County, SC
- North Charleston, SC
- SCDOT / South Carolina statewide DOT fallback

Sample contacts intentionally omit emails and phone numbers unless they are verified. Their source text says `Sample data for local development - not verified official contact`.

## Adding jurisdictions

To add a jurisdiction safely:

1. Add or update an official-source record in `src/lib/contact-routing/verifiedDirectory.ts`.
2. Use `sourceKind: "sample"` if the email/phone/source has not been verified.
3. Only use `sourceKind: "verified-exact"` when the source is official, current, category-specific, and jurisdiction-specific.
4. Add matching seed data in `prisma/seed.ts` if the local database should show the contact.
5. Add routing tests in `src/lib/contact-routing/__tests__/service.test.ts`.
6. Run:

```bash
npm run test:coverage
npm run typecheck
npm run build
```

Do not invent phone numbers or emails. If exact real contacts are not available, use a lookup URL and clearly mark the record as sample or requiring official verification.

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
npm run test:coverage
npm run typecheck
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

Seed data creates a demo user, sample reports, issue categories, South Carolina sample jurisdictions/contacts, and Pro plan records. Sample contacts are explicitly marked as unverified development data.

## Safety disclaimer

ReportRight AI does not provide legal advice. AI-generated reports may be inaccurate and must be reviewed before sending. Users are responsible for verifying recipients and report details. For emergencies or immediate danger, call emergency services. ReportRight AI is not affiliated with any government agency unless explicitly stated.
