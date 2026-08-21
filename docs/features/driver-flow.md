# Feature: Driver Flow

Find and book legal parking in Lucena City.

## Screens and Files

| File | Role |
|---|---|
| `src/screens/driver/MapScreen.tsx` | Map view with spot pins, bottom sheet |
| `src/screens/driver/BookingScreen.tsx` | Duration/plate/vehicle selection |
| `src/screens/driver/PaymentScreen.tsx` | Payment method selection, booking creation |
| `src/screens/driver/ConfirmedScreen.tsx` | Booking confirmation with reference |
| `src/services/spots.service.ts` | Data source for pins |
| `src/services/bookings.service.ts` | Creates the booking |
| `src/store/booking.store.ts` | Draft state passed across all 4 screens |
| `src/data/mock-spots.ts` | 15 mock spots with real Lucena coords |

## Data Flow

```
MapScreen
  → spotService.getNearby() → all 15 spots
  → user selects spot → setSpot(spot) in booking.store
  → navigate /driver/spot

BookingScreen
  → reads spot from booking.store (no route param)
  → user fills: durationHours, plateNumber, vehicleType
  → setDraft() in booking.store
  → navigate /driver/payment

PaymentScreen
  → reads full draft from booking.store
  → user picks paymentMethod
  → bookingService.create(payload) → Booking with PS-XXXX ref
  → setConfirmedBooking(booking)
  → navigate /driver/confirmed

ConfirmedScreen
  → reads confirmedBooking from booking.store
  → displays reference, times, total
```

## Inputs

- **Spot:** `ParkingSpot` object from booking.store (set by MapScreen)
- **Plate number:** string, min 6 chars, uppercased
- **Duration:** 1, 2, 3, or 4 hours
- **Vehicle type:** 'car' or 'motorcycle' (filtered by spot's `vehicleTypes`)
- **Payment:** 'gcash', 'maya', or 'cash'

## BREAK RISK

| If you do this | This breaks |
|---|---|
| Remove `setSpot()` call in MapScreen | BookingScreen has no spot — blank/crash |
| Change `booking.store` field names | All 4 screens read from store — all break simultaneously |
| Add a required field to `CreateBookingPayload` | bookingService.create() TypeScript error — won't compile |
| Change ZoneType values ('green'/'yellow'/'red') | MapScreen pin colors and bottom sheet logic all break |
| Break `vehicleTypes` filtering in BookingScreen | Users can book car-only spots with motorcycles |
| Remove `slotsAvailable` check in MapScreen | Full spots show "Book This Spot" button |

## Dependencies

- `AuthGuard` — all routes protected; if guard is bypassed, unauthenticated users reach booking
- `booking.store` — shared state; if reset() is called mid-flow, screens go blank
- `Leaflet + react-leaflet` — map won't render if package is removed or CSS not imported in `main.tsx`
- `LUCENA_CENTER` constant from `mock-spots.ts` — map centering and initial fetch lat/lng
