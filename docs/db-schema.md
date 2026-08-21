# DB Schema

## Supabase Project

Project ref: `tdtiymcxklesavocsfyf`
Region: (check dashboard)
Connection: via `@supabase/supabase-js` v2 using anon key + RLS

## Tables

### `auth.users` (Supabase managed)

Built-in Supabase auth table. Not directly written by the app.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key — referenced by `profiles.id` |
| `phone` | text | E.164 format (e.g. `+639171234567`) |
| `created_at` | timestamptz | Auto |

### `public.profiles`

One row per authenticated user. Created on first login after OTP verification.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `id` | uuid | NO | PK — FK → `auth.users(id)` ON DELETE CASCADE |
| `phone` | text | NO | E.164 format, matches `auth.users.phone` |
| `full_name` | text | NO | Entered by user on ProfileScreen |
| `created_at` | timestamptz | YES | Defaults to `now()` |

**FK Note:** `profiles.id` references `auth.users(id)`. Deleting an auth user cascades and deletes the profile row.

## RLS Policies on `profiles`

| Policy | Operation | Rule |
|---|---|---|
| `profiles: self read` | SELECT | `auth.uid() = id` |
| `profiles: self insert` | INSERT | `auth.uid() = id` |
| `profiles: self update` | UPDATE | `auth.uid() = id` |

No DELETE policy — profiles are permanent while the user account exists.

## JSONB Fields

None in the current schema.

## Migrations

| File | Applied | Description |
|---|---|---|
| `supabase/migrations/001_profiles.sql` | 2026-08-21 | Create profiles table + RLS policies |

## Future Tables (Planned)

When mock data is replaced with real backend:

| Table | Purpose |
|---|---|
| `parking_spots` | Real spot listings with owner FK |
| `bookings` | Real booking records with user/spot FK |
| `owners` | Owner profile extending `profiles` |
