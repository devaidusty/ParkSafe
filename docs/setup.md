# Setup

## Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Dashboard → Project Settings → API |

Create `.env.local` at the project root (already gitignored):

```
VITE_SUPABASE_URL=https://tdtiymcxklesavocsfyf.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Never commit the real key. Never use the `service_role` key in the frontend.

## External Services

| Service | Purpose | Status |
|---|---|---|
| Supabase | Auth (Phone OTP) + `profiles` table | Connected — project `tdtiymcxklesavocsfyf` |
| OpenStreetMap | Map tiles via Leaflet (no API key) | Free, no setup |
| Twilio (optional) | SMS delivery for Phone OTP | Not yet configured — see below |

## Run Locally

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase keys
npm run dev
```

App runs at `http://localhost:5173`.

## First User / Test Login

**Option A — Test OTP (no Twilio, free)**

1. Supabase dashboard → Authentication → Providers → Phone → toggle ON
2. Scroll to "Test OTPs" → add number `+639170000001` → code `123456`
3. Log in with that number in the app

**Option B — Real SMS via Twilio**

1. Sign up at twilio.com → get Account SID, Auth Token, and a phone number
2. Supabase dashboard → Authentication → Providers → Phone → Twilio section → fill in credentials

## Database Setup

Run the migration in Supabase SQL Editor (already applied to project `tdtiymcxklesavocsfyf`):

```sql
-- See supabase/migrations/001_profiles.sql
```

## PWA / Install

Build produces a service worker via `vite-plugin-pwa`. Users can install it from Chrome/Safari on Android/iOS using the "Add to Home Screen" prompt.

```bash
npm run build
npm run preview   # test the PWA build locally
```
