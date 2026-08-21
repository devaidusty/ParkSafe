# Feature: Onboarding / Auth

Phone OTP authentication using Supabase Auth. First-time users complete 3 steps: phone → OTP → profile name. Returning users complete 2 steps: phone → OTP → land on Role Select.

## Screens and Files

| File | Role |
|---|---|
| `src/screens/onboarding/PhoneScreen.tsx` | PH number entry, E.164 conversion, signInWithOtp |
| `src/screens/onboarding/OTPScreen.tsx` | 6-digit code entry, auto-submit, resend countdown |
| `src/screens/onboarding/ProfileScreen.tsx` | Full name entry, inserts to profiles table |
| `src/components/ui/AuthGuard.tsx` | Redirects unauthenticated users to /onboarding/phone |
| `src/store/auth.store.ts` | user, profile, loading state |
| `src/lib/supabase.ts` | Supabase client, Profile interface |
| `src/App.tsx` | Session init + onAuthStateChange listener |

## Data Flow

```
App.tsx mounts
  → supabase.auth.getSession()
    → session: setUser(u) → fetch profiles row → setProfile(data) → setLoading(false)
    → no session: setLoading(false)
  → supabase.auth.onAuthStateChange listener registered

/onboarding/phone
  → user types PH number (09XXXXXXXXX or 9XXXXXXXXX)
  → toE164() converts to +639XXXXXXXXX
  → supabase.auth.signInWithOtp({ phone: e164 })
  → navigate /onboarding/otp with state: { phone: e164 }

/onboarding/otp
  → receives phone from location.state
  → user enters 6-digit OTP (auto-submits at 6 digits, 150ms delay)
  → supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  → on success: setUser(data.user)
  → check profiles table for existing row
    → profile exists → navigate /
    → no profile → navigate /onboarding/profile with state: { phone }

/onboarding/profile
  → receives phone from location.state
  → user enters full name
  → supabase.from('profiles').insert({ id: user.id, phone, full_name })
  → setProfile(data) → navigate /

AuthGuard (on every protected route)
  → loading=true → spinner
  → user=null (loading=false) → navigate /onboarding/phone
  → user set → render children
```

## E.164 Conversion Logic

```
09XXXXXXXXX (11 digits, starts with 0) → strip 0, prepend +63
9XXXXXXXXX  (10 digits, starts with 9) → prepend +63
639XXXXXXXXX (12 digits, starts with 63) → prepend +
Already +63XXXXXXXXX → return as-is
```

## BREAK RISK

| If you do this | This breaks |
|---|---|
| Remove `loading: true` default from auth.store | AuthGuard renders screens before session resolves → flicker/redirect loop |
| Remove `setLoading(false)` after getSession in App.tsx | App stuck on spinner forever |
| Change `profiles` table name without updating all queries | Profile check fails silently → every user forced through profile setup on every login |
| Change location.state key `phone` in PhoneScreen | OTPScreen gets undefined phone → can't verify OTP |
| Break `toE164()` for `09XXXXXXXXX` format | Most PH users (Globe/Smart) can't send OTP |
| Remove `onAuthStateChange` listener in App.tsx | Sign-out doesn't update AuthGuard → user appears logged in |

## Dependencies

- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in `.env.local` — required; missing = blank screen
- Supabase Phone provider enabled — required; disabled = "Phone provider not enabled" error
- `profiles` table with RLS — required for profile check; missing = onboarding loop for new users
- Phone OTP SMS provider (Twilio) OR test OTP numbers — required for real verification
