# Rollback

## Decision Table: Rollback vs Hotfix

| Situation | Action |
|---|---|
| New feature broke something unrelated | Rollback frontend deployment |
| Auth is completely broken for all users | Rollback immediately, then hotfix |
| One screen crashes but core flow works | Hotfix preferred (less disruption) |
| Bad DB migration applied | Write reverse SQL + apply, then assess data damage |
| Env var wrong / missing | Fix env var in host dashboard, redeploy — no rollback needed |
| Style / cosmetic regression | Hotfix in place |

**Rule:** If more than one critical flow is broken → rollback. If one isolated screen → hotfix.

## Frontend Rollback (Vercel)

*(App not yet deployed to Vercel — these steps apply when it is)*

1. Go to Vercel dashboard → Project → **Deployments**
2. Find the last working deployment (green check)
3. Click the three-dot menu → **Promote to Production**
4. Verify the live URL is restored within ~30 seconds

No build is required. Instant rollback.

## Database Rollback

Write the reverse SQL **before** applying any risky migration. Add it as a comment in the migration file.

### Current migrations and their reverses

**001_profiles** (applied 2026-08-21)

```sql
-- Reverse of 001_profiles.sql (run only to undo)
drop policy if exists "profiles: self update" on public.profiles;
drop policy if exists "profiles: self insert" on public.profiles;
drop policy if exists "profiles: self read" on public.profiles;
drop table if exists public.profiles;
```

⚠️ Running the reverse drops all user profile data permanently.

### Template for future migrations

```sql
-- Forward migration
create table ...;

-- ↑ Reverse (copy to rollback.md before applying forward)
-- drop table ...;
```

## What Rollback Does NOT Fix

- Data already written to the database (profiles, bookings) before the rollback
- OTP sessions already in flight
- Users who already created accounts — their `auth.users` rows persist even if `profiles` is dropped

## Post-Rollback Checklist

- [ ] Open `docs/incidents.md` — create a new INC entry for the incident
- [ ] Assess data damage: did any rows get corrupted or duplicated?
- [ ] Identify root cause before redeploying the reverted change
- [ ] Run the manual test checklist (`docs/testing.md`) against the rolled-back version
- [ ] Note in the INC entry whether monitoring caught the issue or it was reported by a user
