# Architecture

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18.3 |
| Language | TypeScript | 5.5 |
| Bundler | Vite | 5.4 |
| PWA | vite-plugin-pwa + Workbox | 0.20 |
| Routing | React Router v6 | 6.26 |
| State | Zustand | 4.5 |
| Map | Leaflet + react-leaflet + OpenStreetMap | 1.9 / 4.2 |
| Auth + DB | Supabase JS v2 | 2.112 |
| Styling | Tailwind CSS v3 (JIT) | 3.4 |
| Fonts | Inter (body) + DM Mono (labels) | Google Fonts |

## Request Lifecycle (Auth)

```
User opens app
  → App.tsx: supabase.auth.getSession()
    → session found → setUser() → fetch profiles row → setProfile() → setLoading(false)
    → no session → setLoading(false)
  → RouterProvider renders
    → protected route → AuthGuard checks user+loading
      → loading=true → spinner
      → user=null → redirect /onboarding/phone
      → user set → render screen
```

## Request Lifecycle (Booking)

```
Driver opens /driver/map
  → MapScreen: spotService.getNearby() → returns mockSpots (300ms delay)
  → User clicks pin → bottom sheet opens
  → "Book This Spot" → setSpot(spot) in booking.store → navigate /driver/spot
  → BookingScreen: reads spot from store, user fills plate/duration/vehicle
  → "Continue to Payment" → navigate /driver/payment
  → PaymentScreen: bookingService.create(payload) → pushes to in-memory array → navigate /driver/confirmed
  → ConfirmedScreen: shows reference code (PS-XXXX)
```

## File Structure

```
src/
├── App.tsx                  — auth listener + RouterProvider
├── main.tsx                 — ReactDOM.createRoot, imports CSS
├── index.css                — Tailwind directives, #root layout, Leaflet z-index
├── router/
│   └── index.tsx            — createBrowserRouter, AuthGuard wrapper
├── lib/
│   └── supabase.ts          — createClient, Profile interface
├── store/
│   ├── auth.store.ts        — user, profile, loading, setUser, setProfile, signOut
│   ├── booking.store.ts     — draft booking state across driver flow screens
│   └── owner.store.ts       — owner spots/bookings cache
├── types/
│   └── index.ts             — ZoneType, VehicleType, PaymentMethod, BookingStatus, ParkingSpot, Booking, OwnedSpot
├── data/
│   ├── mock-spots.ts        — 15 spots (8 green, 4 yellow, 3 red), LUCENA_CENTER
│   └── mock-bookings.ts     — 6 bookings, getActiveBookingByPlate()
├── services/
│   ├── spots.service.ts     — SpotService interface + MockSpotService
│   ├── bookings.service.ts  — BookingService interface + MockBookingService
│   ├── owners.service.ts    — OwnerService interface + MockOwnerService
│   └── enforcer.service.ts  — EnforcerService interface + MockEnforcerService
├── components/
│   └── ui/
│       ├── AuthGuard.tsx    — redirect to /onboarding/phone if no session
│       ├── Button.tsx       — primary/outline/ghost, sm/md/lg, loading
│       ├── TopBar.tsx       — back button, title, right slot
│       ├── Badge.tsx        — green/yellow/red/gray/black
│       ├── Input.tsx        — border-bottom style, label
│       └── Card.tsx         — default/white/dark
└── screens/
    ├── RoleSelectScreen.tsx           — /, shows profile name + sign-out
    ├── onboarding/
    │   ├── PhoneScreen.tsx            — /onboarding/phone
    │   ├── OTPScreen.tsx              — /onboarding/otp
    │   └── ProfileScreen.tsx          — /onboarding/profile
    ├── driver/
    │   ├── MapScreen.tsx              — /driver/map
    │   ├── BookingScreen.tsx          — /driver/spot
    │   ├── PaymentScreen.tsx          — /driver/payment
    │   └── ConfirmedScreen.tsx        — /driver/confirmed
    ├── owner/
    │   ├── OwnerDashboard.tsx         — /owner
    │   ├── ListSpotScreen.tsx         — /owner/list
    │   └── BookingsScreen.tsx         — /owner/bookings
    └── enforcer/
        └── PlateCheckScreen.tsx       — /enforcer
```

## Multi-Tenancy

None — single-city prototype (Lucena City). All data is scoped to one city. No tenant isolation required at this stage.

## Key Data Flows

1. **Auth state** — `supabase.auth.onAuthStateChange` in App.tsx → `useAuthStore` → `AuthGuard` reads it
2. **Booking draft** — `useBookingStore` passes spot/plate/duration/payment across 4 screens without URL params
3. **Plate check** — `enforcerService.checkPlate()` normalizes plate (uppercase, collapse spaces), searches active bookings
4. **Owner data** — pre-seeded: owner "owns" spot-001, spot-002, spot-003 in `MockOwnerService`
5. **Map pins** — Leaflet `divIcon` with inline CSS (no default markers — avoids Vite icon path bug)
