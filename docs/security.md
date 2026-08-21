# Security

## Auth Model

Phone OTP via Supabase Auth. No passwords. A session JWT is issued after OTP verification and stored in `localStorage` by the Supabase JS client.

- Session token: Supabase JWT (managed by `@supabase/supabase-js`)
- Session lifetime: Supabase default (1 hour access token, auto-refreshed via refresh token)
- Logout: `supabase.auth.signOut()` + `useAuthStore.signOut()` clears both server session and local store

## Role Hierarchy

There is no server-enforced role system in the prototype. Roles are UI-only — the user self-selects on the Role Select screen.

| Role | Access | Enforced by |
|---|---|---|
| Driver | `/driver/*` routes | AuthGuard (client-side) |
| Space Owner | `/owner/*` routes | AuthGuard (client-side) |
| Enforcer | `/enforcer` route | AuthGuard (client-side) |

**Important:** Any authenticated user can navigate to any role's routes. Server-side role enforcement is a future task when the backend moves off mock data.

## Access Control Rules — Must Never Be Broken

1. **Never expose `service_role` key to the frontend.** Only `VITE_SUPABASE_ANON_KEY` (anon key) goes in `.env.local`. The service_role key bypasses all RLS.
2. **Never commit `.env.local`.** It is gitignored. Credentials must stay out of version control.
3. **AuthGuard must wrap all non-onboarding routes.** Any route outside `/onboarding/*` must render `<AuthGuard>`. Removing the guard exposes screens to unauthenticated users.
4. **`profiles` RLS policies must remain active.** Users may only read/write their own profile row (`auth.uid() = id`). Do not disable RLS on the profiles table.

## Three Client Types (Future)

When real backend logic is added:

| Client | Key used | Access |
|---|---|---|
| Frontend (browser) | anon key | Row-level security enforced |
| Admin/scripts | service_role key | Full access — never in browser |
| Edge Functions | service_role (server-side only) | Full access — server environment only |

## Known Limitations (Prototype)

- **No server-side role enforcement** — any authenticated user can reach any role's screen
- **Mock data in memory** — bookings/spots reset on page reload; no persistence except `profiles` table
- **No rate limiting** — OTP send has no throttle on the frontend (Supabase enforces a basic rate limit server-side)
- **Phone auth requires Twilio** for real SMS — without it, only test phone numbers work
