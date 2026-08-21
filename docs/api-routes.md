# API Routes

## Overview

ParkSafe prototype has no custom HTTP API. All data operations go through:
1. **Supabase REST API** — for `profiles` table (auth-scoped, via anon key + RLS)
2. **Mock service layer** — in-memory for spots, bookings, owner data, enforcer checks

When moving to real data, replace each mock service class with a real implementation that calls Supabase or a custom API.

## Supabase Calls (Real)

### Auth

| Operation | Call | Screen |
|---|---|---|
| Send OTP | `supabase.auth.signInWithOtp({ phone })` | PhoneScreen |
| Verify OTP | `supabase.auth.verifyOtp({ phone, token, type: 'sms' })` | OTPScreen |
| Get session | `supabase.auth.getSession()` | App.tsx (on mount) |
| Auth change listener | `supabase.auth.onAuthStateChange(...)` | App.tsx |
| Sign out | `supabase.auth.signOut()` | RoleSelectScreen |

### Profiles Table

| Operation | Call | Screen |
|---|---|---|
| Check if profile exists | `supabase.from('profiles').select('*').eq('id', user.id).single()` | OTPScreen, App.tsx |
| Create profile | `supabase.from('profiles').insert({ id, phone, full_name })` | ProfileScreen |

## Mock Service Methods

### `spotService` (`src/services/spots.service.ts`)

| Method | Signature | Returns | Delay |
|---|---|---|---|
| `getNearby` | `(lat, lng) → Promise<ParkingSpot[]>` | All 15 mock spots | 300ms |
| `getById` | `(id) → Promise<ParkingSpot \| undefined>` | Single spot by id | 150ms |

**Swap point:** Replace `MockSpotService` with a real implementation calling `supabase.from('parking_spots').select(...)`.

### `bookingService` (`src/services/bookings.service.ts`)

| Method | Signature | Returns | Delay |
|---|---|---|---|
| `create` | `(payload: CreateBookingPayload) → Promise<Booking>` | New booking with `PS-XXXX` reference | 400ms |
| `getAll` | `() → Promise<Booking[]>` | All bookings (mock + created this session) | 200ms |

**Note:** `create()` pushes to an in-memory array — bookings are lost on page reload.

### `ownerService` (`src/services/owners.service.ts`)

| Method | Signature | Returns | Delay |
|---|---|---|---|
| `getMySpots` | `() → Promise<OwnedSpot[]>` | Spots 001–003 with earnings | 300ms |
| `getMyBookings` | `() → Promise<Booking[]>` | Bookings for spots 001–003 | 300ms |
| `listSpot` | `(data) → Promise<OwnedSpot>` | New spot added to in-memory array | 600ms |

### `enforcerService` (`src/services/enforcer.service.ts`)

| Method | Signature | Returns | Delay |
|---|---|---|---|
| `checkPlate` | `(plate: string) → Promise<PlateCheckResult>` | `{ found, booking?, minutesRemaining? }` | 500ms |

Plate normalization: `toUpperCase().replace(/\s+/g, ' ').trim()` — must match exactly.

## Router (Client-Side)

| Path | Screen | Auth |
|---|---|---|
| `/onboarding/phone` | PhoneScreen | Public |
| `/onboarding/otp` | OTPScreen | Public |
| `/onboarding/profile` | ProfileScreen | Public |
| `/` | RoleSelectScreen | Protected |
| `/driver/map` | MapScreen | Protected |
| `/driver/spot` | BookingScreen | Protected |
| `/driver/payment` | PaymentScreen | Protected |
| `/driver/confirmed` | ConfirmedScreen | Protected |
| `/owner` | OwnerDashboard | Protected |
| `/owner/list` | ListSpotScreen | Protected |
| `/owner/bookings` | BookingsScreen | Protected |
| `/enforcer` | PlateCheckScreen | Protected |
