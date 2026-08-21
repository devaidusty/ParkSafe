# Monitoring

## Current State

No error tracking service is configured yet. Two sources of runtime visibility are available right now without any setup:

### 1. Supabase Logs

Dashboard → **Logs** section:

| Log type | What it shows | When to check |
|---|---|---|
| Auth logs | OTP sends, verifications, sign-ins, errors | Whenever a user reports "I didn't get the code" or "code invalid" |
| API logs | All REST calls (profiles select/insert) | Whenever a user reports a save error |
| Database logs | Query errors, RLS violations | When a profile insert fails silently |

**Finding OTP codes for testing (no Twilio):** Auth logs show the OTP sent to test numbers.

### 2. Vite Dev Server Logs

`npm run dev` logs in the terminal. Shows HMR errors, TypeScript compile errors on save.

### 3. Browser Console

Open DevTools → Console. Network tab shows failed Supabase API calls with status codes.

---

## Errors That Must Alert Immediately (Future Setup)

When Sentry or similar is added, these must trigger alerts:

| Error | Impact |
|---|---|
| `supabase.auth.verifyOtp` returns error on valid code | Auth broken — users cannot log in |
| `profiles` insert fails | New users cannot complete onboarding |
| `supabase.auth.getSession` throws | All protected routes inaccessible |
| Map tiles fail to load | Driver flow unusable |

## Errors to Watch But Not Alert

| Error | Notes |
|---|---|
| `ERR_CONNECTION_REFUSED` on localhost | Dev server not running |
| `406 Not Acceptable` on profiles select | User has no profile yet — normal during onboarding |
| Leaflet console warnings | Usually harmless attribution or control warnings |

## Recommended Next Steps

1. **Add Sentry** — `npm install @sentry/react`, wrap `<App>` with `Sentry.ErrorBoundary`
2. **Add Vercel Analytics** — one line in `index.html` after deploying to Vercel
3. **Set up Supabase email alerts** — Dashboard → Settings → Alerts → enable auth failure alerts

## How Errors Feed Back into incidents.md

For every confirmed production bug:

1. Open `docs/incidents.md`
2. Add INC entry with the error message, which log it appeared in, and whether monitoring caught it automatically or a user reported it first
3. Note: "Monitoring caught it: Yes / No" in the INC entry

This creates a record of monitoring gaps and helps justify adding alert rules.
