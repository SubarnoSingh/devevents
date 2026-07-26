# PostHog setup report

PostHog browser analytics was added to the Next.js event-listing app, with three UI events, global exception autocapture, and a starter dashboard.

## Installed and initialized

- Declared `posthog-js` at `^1.297.0` in `package.json` and resolved it with `npm install`; the resulting lockfile is `package-lock.json`.
- Initialized the browser SDK once in `instrumentation-client.ts` using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment. The configured environment uses the EU PostHog host. SDK defaults remain enabled, with development debugging and `capture_exceptions: true`.
- Documented the required environment keys in `.env.example`; the real values were set in the local `.env` through wizard environment tooling.
- No provider or second SDK initialization was added. No CSP policy was found in the inspected project files.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `explore_events_clicked` | A visitor selects the hero call-to-action to browse featured events. | `components/ExploreBtn.tsx` |
| `event_selected` | A visitor opens a specific event from the featured-event list. | `components/EventCard.tsx` |
| `navigation_clicked` | A visitor selects a primary navigation destination. | `components/Navbar.tsx` |

The event properties recorded in the event plan are non-PII UI metadata: hero source, event slug/location/date, and navigation destination. The run verified that captures are placed in the relevant click handlers and use lower-snake-case names. It did **not** observe events arriving in PostHog, so ingestion and runtime delivery remain unconfirmed.

## User identification

Identification was skipped. Repository review found no authentication, session, login, registration, logout, user record, API route, middleware, cookie, or request-header identity boundary. Events therefore use anonymous browser identity. If authentication is added later, wire `identify()` with a stable non-PII user ID after login or registration and `reset()` on logout; also cover returning authenticated visitors.

## Error tracking

Global uncaught browser exception tracking is enabled through `capture_exceptions: true` in `instrumentation-client.ts`. No manual exception handlers, boundaries, or scattered `captureException` calls were added. The run verified configuration and code placement, but did not trigger an exception or observe an error event in PostHog.

## Verification and conflicts

- `npm install` completed successfully and audited 605 packages. It reported six dependency audit findings and blocked optional install scripts for `core-js`, `sharp`, and `unrs-resolver`; these did not prevent build verification.
- `npm run build` completed successfully, including TypeScript checking and static-page generation. This proves the code compiles; it does not prove that analytics events or exceptions reach PostHog.
- `npm run lint` remains blocked by three pre-existing errors outside the integration changeset: one `react/no-unescaped-entities` error in `app/page.tsx`, and two `@typescript-eslint/no-explicit-any` errors in `components/LightRays.tsx`. No integration file was reported as failing lint.

## Dashboard

[Analytics basics (wizard)](https://eu.posthog.com/project/231094/dashboard/844540)

The dashboard contains three last-30-days trends: hero exploration clicks, featured event selections, and navigation clicks broken down by destination. The dashboard exists, but its insights may remain empty until events arrive; the run did not verify data ingestion.

## Issues to follow up

1. **Runtime delivery is unresolved:** no event or exception was observed arriving in PostHog. If left unresolved, the dashboard can remain empty and product decisions will lack telemetry despite the successful build.
2. **User attribution is unresolved:** the app has no stable authenticated user identity seam, so events cannot currently be attributed to users. If left unresolved after authentication is introduced, activity will remain anonymous or fragmented across browser identities.
3. **Lint is unresolved:** the three existing errors in `app/page.tsx` and `components/LightRays.tsx` remain. If left unresolved, the repository cannot pass its current lint command even though the production build succeeds.

## Before you merge

- [ ] Run a full production build and confirm the generated integration still passes; the wizard ran `npm run build`, but repeat it in the merge environment.
- [ ] Run the test suite and update mocks or fixtures for the capture calls in `components/ExploreBtn.tsx:7`, `components/EventCard.tsx:13`, and `components/Navbar.tsx:8` if needed.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from `.env.example` in every deployment environment, not only local `.env`; inspect `instrumentation-client.ts:4-5` for the exact reads.
- [ ] Trigger the hero CTA, an event card, and each primary navigation link, then confirm `explore_events_clicked`, `event_selected`, and `navigation_clicked` arrive in PostHog; inspect `components/ExploreBtn.tsx:6-9`, `components/EventCard.tsx:12-18`, and `components/Navbar.tsx:7-11`.
- [ ] Resolve or explicitly accept the three lint errors in `app/page.tsx` and `components/LightRays.tsx` before merging.
- [ ] If authentication is introduced, add `identify(stableUserId, ...)` after login/registration and `reset()` on logout, then verify returning authenticated visitors; the current identity review found no applicable seam.
