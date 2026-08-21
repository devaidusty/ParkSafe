# CLAUDE.md — ParkSafe Lucena

## 1. Docs Index

| File | Description |
|---|---|
| `docs/setup.md` | Env vars, external services, local run, first user setup |
| `docs/architecture.md` | Stack, request lifecycles, full file structure, data flows |
| `docs/security.md` | Auth model, RLS rules, role table, known limitations |
| `docs/db-schema.md` | Every table, every column, FK relationships, migration history |
| `docs/db-change-protocol.md` | Pre-migration checklist, critical columns, files with hardcoded enums |
| `docs/api-routes.md` | Supabase calls, mock service signatures, client-side router table |
| `docs/incidents.md` | Confirmed production bugs — open this first when debugging |
| `docs/changelog.md` | Every task logged, most recent first |
| `docs/testing.md` | Manual test checklists for all 4 flows |
| `docs/rollback.md` | Rollback vs hotfix decision table, Vercel + DB rollback steps |
| `docs/monitoring.md` | Current visibility sources, error tracking setup, alert priorities |
| `docs/features/driver-flow.md` | Driver: map → booking → payment → confirmed |
| `docs/features/owner-flow.md` | Owner: dashboard → list spot → bookings |
| `docs/features/enforcer-flow.md` | Enforcer: plate check, normalization, test plates |
| `docs/features/onboarding-auth.md` | Phone OTP auth, E.164 conversion, AuthGuard, session init |

---

## 2. Pre-Change Table

| You are about to edit… | Read first |
|---|---|
| `src/App.tsx` | `docs/features/onboarding-auth.md` — session init order matters |
| `src/router/index.tsx` | `docs/security.md` — AuthGuard must wrap all non-onboarding routes |
| `src/components/ui/AuthGuard.tsx` | `docs/features/onboarding-auth.md` — loading state is critical |
| `src/lib/supabase.ts` | `docs/security.md` — never swap to service_role key |
| `src/store/auth.store.ts` | `docs/features/onboarding-auth.md` — loading default must stay true |
| `src/store/booking.store.ts` | `docs/features/driver-flow.md` — all 4 driver screens read from this |
| `src/screens/onboarding/PhoneScreen.tsx` | `docs/features/onboarding-auth.md` |
| `src/screens/onboarding/OTPScreen.tsx` | `docs/features/onboarding-auth.md` |
| `src/screens/onboarding/ProfileScreen.tsx` | `docs/features/onboarding-auth.md`, `docs/db-schema.md` |
| `src/screens/driver/MapScreen.tsx` | `docs/features/driver-flow.md` |
| `src/screens/driver/BookingScreen.tsx` | `docs/features/driver-flow.md` |
| `src/screens/driver/PaymentScreen.tsx` | `docs/features/driver-flow.md` |
| `src/screens/driver/ConfirmedScreen.tsx` | `docs/features/driver-flow.md` |
| `src/screens/owner/*.tsx` | `docs/features/owner-flow.md` |
| `src/screens/enforcer/PlateCheckScreen.tsx` | `docs/features/enforcer-flow.md` |
| `src/services/enforcer.service.ts` | `docs/features/enforcer-flow.md` — plate normalization |
| `src/services/bookings.service.ts` | `docs/features/enforcer-flow.md` — normalization must match |
| `src/types/index.ts` | `docs/db-change-protocol.md` — enum strings used everywhere |
| `src/data/mock-spots.ts` | `docs/features/driver-flow.md`, `docs/features/owner-flow.md` |
| `src/data/mock-bookings.ts` | `docs/features/enforcer-flow.md` — test plates here |
| `supabase/migrations/*.sql` | `docs/db-change-protocol.md` + `docs/rollback.md` |
| Any task start/complete | `docs/changelog.md` — add CHG entry |
| Any error investigation | `docs/monitoring.md` + `docs/incidents.md` |
| Any critical flow change | `docs/testing.md` — run relevant checklist |

---

## 3. Security Rules — Must Never Be Broken

1. **Never put `service_role` key in the frontend.** Only `VITE_SUPABASE_ANON_KEY` goes in `.env.local`. Service role bypasses all RLS — exposure = full database access.
2. **Never commit `.env.local`.** Already gitignored. If accidentally committed, rotate the Supabase keys immediately.
3. **AuthGuard must wrap every non-onboarding route.** The guard (`<AuthGuard>`) is the only thing between an unauthenticated user and all app screens. Removing it from any route is a security regression.
4. **RLS must stay enabled on `profiles`.** Disabling RLS means any authenticated user can read or modify other users' profiles.
5. **Phone OTP is the only auth method.** Do not add email/password auth without updating the onboarding flow, AuthGuard, and the `profiles` table.

---

## 4. Critical Data Flows — Easy to Accidentally Break

1. **Auth loading state** — `auth.store` initializes `loading: true`. App.tsx sets it `false` only after `getSession()` resolves. AuthGuard shows a spinner while `loading=true`. If `setLoading(false)` is removed or called too early, AuthGuard either spins forever or flashes a redirect before the session loads.

2. **Booking store across screens** — The driver flow passes the selected `ParkingSpot` through `booking.store` (not URL params). MapScreen calls `setSpot()`, then BookingScreen, PaymentScreen, and ConfirmedScreen all read from the store. If the store resets between screens (or `setSpot()` is removed from MapScreen), every downstream screen gets null/undefined data.

3. **Plate normalization must match** — `enforcerService.checkPlate()` normalizes with `toUpperCase().replace(/\s+/g, ' ').trim()`. Bookings are stored with plates uppercased via `plateNumber.toUpperCase()` in `MockBookingService.create()`. These two must stay in sync. Changing one without the other means no plate ever matches.

4. **Profile existence check in OTPScreen** — After OTP verification, OTPScreen queries `profiles` to decide: go to `/` (returning user) or `/onboarding/profile` (new user). If the profiles table is missing or renamed, the query silently returns null and every user is forced through profile setup on every login.

5. **E.164 conversion for PH numbers** — `toE164()` in PhoneScreen handles `09XXXXXXXXX` → `+639XXXXXXXXX`. Supabase requires E.164 format for Phone OTP. If the conversion breaks for the common `09XX` format (used by Globe and Smart — the two largest PH carriers), most users can't sign in.

6. **Leaflet CSS must be imported in main.tsx** — `import 'leaflet/dist/leaflet.css'` in `src/main.tsx` is what makes the map render correctly. Removing it causes the map to render without styles — tiles overlap, controls are invisible.

---

## 5. Changelog Protocol

Every task must be logged in `docs/changelog.md`. No exceptions.

**Before starting:** add a CHG entry with date, type, requested, decision. Mark changes and commits as `(pending)`.

**After completing:** fill in every file touched and every commit hash.

**DB migration rule:** after any migration, `docs/db-schema.md` must be updated before the task closes. A migration with no `db-schema.md` update is incomplete.

**CHG entry format:**
```
## CHG-NNN — [Short title]

**Date:** YYYY-MM-DD
**Type:** Feature / Fix / Refactor / Config (Frontend) / Config (Supabase) / Docs / Design
**Requested:** [what was asked for]
**Decision:** [approach chosen and why]
**Changes:**
- `path/to/file.ts` — what changed
**Commits:** `abc1234`
```

Types:
- **Config (Frontend)** — vite.config, tsconfig, tailwind.config, env vars, build config
- **Config (Supabase)** — RLS policies, migrations, auth settings, storage, dashboard changes

---

## 6. Incident Protocol

**Before debugging:** check `docs/incidents.md` first. If the symptom matches an existing INC entry, go straight to the fix.

**After fixing a confirmed production bug:** add an INC entry before closing the task.

**In every INC entry, note:** whether monitoring caught it automatically or a user reported it first.

**INC entry format:**
```
## INC-NNN — [Short description of symptom]

**Status:** Open / Resolved — YYYY-MM-DD

### What broke
### Platform impact
### Root cause
### Investigation log
### Fix
### Commits
### Cross-check
### Monitoring caught it? Yes / No
```

---

## 7. PRE-IMPLEMENTATION GATE — HARD STOP

Before implementing any change, state:
- Confidence level: HIGH / MEDIUM / LOW
- What could break if this goes wrong
- Whether investigation is needed first

LOW → stop, investigate, plan, wait for approval
MEDIUM → propose approach + risks, wait for confirmation
HIGH → proceed, flag BREAK RISK areas inline; if the change touches a critical flow, state which checklist items from `docs/testing.md` were verified

HARD STOP: You MUST write the gate output in your response text BEFORE calling any Edit / Write / NotebookEdit tool or any Bash command that modifies files or runs git. The gate must be VISIBLE in your response — thinking it does not count. A code change with no gate text above it is a protocol violation.

Format (copy exactly):
```
**GATE**
- Confidence: HIGH / MEDIUM / LOW
- Break risk: [what breaks if this goes wrong]
- Investigation needed: yes / no — [why]
```
