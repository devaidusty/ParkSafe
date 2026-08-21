# Changelog

Running log of every task, most recent first.

---

## CHG-005 — Documentation and protocol system

**Date:** 2026-08-21
**Type:** Docs
**Requested:** Follow project documentation protocol — create full docs/ structure and CLAUDE.md
**Decision:** Read all source files first, then write all docs in one pass to ensure accuracy
**Changes:**
- `docs/setup.md` — env vars, services, local run, first user setup
- `docs/architecture.md` — stack, request lifecycle, file structure
- `docs/security.md` — auth model, RLS rules, known limitations
- `docs/db-schema.md` — profiles table, RLS policies, migration history
- `docs/db-change-protocol.md` — pre-migration checklist, critical columns, enum files
- `docs/api-routes.md` — Supabase calls, mock service signatures, router table
- `docs/incidents.md` — template ready, no incidents yet
- `docs/changelog.md` — this file
- `docs/testing.md` — manual checklists for all 4 flows
- `docs/rollback.md` — decision table, Vercel + DB rollback steps
- `docs/monitoring.md` — Supabase logs, error tracking setup
- `docs/features/driver-flow.md` — full driver feature doc
- `docs/features/owner-flow.md` — full owner feature doc
- `docs/features/enforcer-flow.md` — full enforcer feature doc
- `docs/features/onboarding-auth.md` — full auth flow doc
- `CLAUDE.md` — pre-change table, security rules, gate protocol
**Commits:** (pending — no git yet)

---

## CHG-004 — Supabase profiles table migration

**Date:** 2026-08-21
**Type:** Config (Supabase)
**Requested:** Create profiles table with RLS
**Decision:** Used Supabase MCP `apply_migration` tool directly
**Changes:**
- `supabase/migrations/001_profiles.sql` — created
- Supabase: `profiles` table + 3 RLS policies applied to project `tdtiymcxklesavocsfyf`
**Commits:** (no git yet)

---

## CHG-003 — Onboarding auth flow (Phone OTP)

**Date:** 2026-08-21
**Type:** Feature
**Requested:** Onboarding flow with Supabase Phone OTP auth
**Decision:** Phone OTP chosen because Filipino drivers use mobile numbers as primary ID
**Changes:**
- `.env.local` — Supabase URL + anon key (real credentials)
- `src/lib/supabase.ts` — Supabase client + Profile interface
- `src/store/auth.store.ts` — user, profile, loading state
- `src/components/ui/AuthGuard.tsx` — redirect to /onboarding/phone if no session
- `src/screens/onboarding/PhoneScreen.tsx` — PH number entry, E.164 conversion, signInWithOtp
- `src/screens/onboarding/OTPScreen.tsx` — 6-digit verify, auto-submit on 6 digits, 30s resend
- `src/screens/onboarding/ProfileScreen.tsx` — name entry, inserts to profiles table
- `src/router/index.tsx` — added /onboarding/* routes, wrapped all app routes with AuthGuard
- `src/App.tsx` — added supabase.auth.getSession + onAuthStateChange listener
- `src/screens/RoleSelectScreen.tsx` — profile name display + sign-out button
**Commits:** (no git yet)

---

## CHG-002 — Three role flows (Driver, Owner, Enforcer)

**Date:** 2026-08-21
**Type:** Feature
**Requested:** Complete all three user flows from zero
**Decision:** Mock service layer with typed interfaces so real backend can be swapped in without rewriting screens
**Changes:**
- `src/types/index.ts` — ZoneType, VehicleType, PaymentMethod, BookingStatus, ParkingSpot, Booking, OwnedSpot
- `src/data/mock-spots.ts` — 15 spots with real Lucena City coordinates
- `src/data/mock-bookings.ts` — 6 bookings, getActiveBookingByPlate helper
- `src/services/spots.service.ts` — SpotService interface + mock
- `src/services/bookings.service.ts` — BookingService interface + mock
- `src/services/owners.service.ts` — OwnerService interface + mock
- `src/services/enforcer.service.ts` — EnforcerService interface + mock
- `src/store/booking.store.ts` — draft booking state across driver screens
- `src/store/owner.store.ts` — owner data cache
- `src/components/ui/` — Button, TopBar, Badge, Input, Card
- `src/screens/driver/` — MapScreen, BookingScreen, PaymentScreen, ConfirmedScreen
- `src/screens/owner/` — OwnerDashboard, ListSpotScreen, BookingsScreen
- `src/screens/enforcer/PlateCheckScreen.tsx`
- `src/screens/RoleSelectScreen.tsx`
- `src/router/index.tsx` — initial 9 routes
**Commits:** (no git yet)

---

## CHG-001 — Project scaffold

**Date:** 2026-08-21
**Type:** Feature
**Requested:** PWA prototype (Web, not React Native) — PH market is 70% Android / 30% iOS
**Decision:** Vite + React + TypeScript + Tailwind + vite-plugin-pwa; Leaflet for maps (free, no API key, good PH coverage)
**Changes:**
- `package.json` — all dependencies
- `vite.config.ts` — VitePWA manifest (name: ParkSafe Lucena, standalone display)
- `tailwind.config.ts` — zone colors, Inter/DM Mono fonts, card shadows
- `index.html` — Google Fonts, viewport meta, apple PWA tags
- `src/index.css` — Tailwind directives, #root max-width 430px centered, Leaflet z-index overrides
- `src/main.tsx` — ReactDOM entry
- `.claude/launch.json` — dev server config
**Commits:** (no git yet)
