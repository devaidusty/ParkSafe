# Feature: Enforcer Flow

Enforcers check if a vehicle's plate number is legally parked in ParkSafe.

## Screens and Files

| File | Role |
|---|---|
| `src/screens/enforcer/PlateCheckScreen.tsx` | Plate input + check result display |
| `src/services/enforcer.service.ts` | Plate lookup against active bookings |
| `src/data/mock-bookings.ts` | Source data for active bookings |

## Data Flow

```
Enforcer enters plate → Check Plate button
  → enforcerService.checkPlate(plate)
    → normalize: toUpperCase().replace(/\s+/g, ' ').trim()
    → find active booking matching plate
    → if found: return { found: true, booking, minutesRemaining }
    → if not found: return { found: false }
  → Green card: legally parked (ref, location, time remaining, payment)
  → Red card: not found (issue citation prompt)
```

## Plate Normalization

Input `abc 1234` → normalized `ABC 1234`
Input `ABC1234` → normalized `ABC1234` (no middle space — must match exactly how it was stored)

**Important:** Booking plates are stored as entered by the driver (uppercased in BookingScreen). Enforcer and booking storage must use identical normalization. Current rule: `toUpperCase().replace(/\s+/g, ' ').trim()`.

## Test Plates (Active)

| Plate | Reference | Spot |
|---|---|---|
| `ABC 1234` | PS-2841 | Quezon Ave Private Lot A |
| `XYZ 5678` | PS-3317 | St. Ferdinand Cathedral Compound |
| `LMN 9999` | PS-4102 | Merchan St Commercial Parking |
| `DEF 7890` | PS-5521 | Quezon Ave Private Lot A |

## BREAK RISK

| If you do this | This breaks |
|---|---|
| Change plate normalization in enforcer.service.ts without changing it in bookings.service.ts | Plates stored one way, checked another — lookups always fail |
| Change `status: 'active'` string in types/index.ts or mock-bookings.ts | `b.status === 'active'` filter returns no results — all plates appear "not found" |
| Remove `minutesRemaining` from `PlateCheckResult` | Time remaining shows undefined in result card |
| Change booking `endTime` format (away from ISO string) | `new Date(booking.endTime).getTime()` breaks minutesRemaining calc |

## Dependencies

- `mock-bookings.ts` — all data; when replaced with real API, `enforcerService` is the only swap point
- `BookingStatus` type — `'active'` literal must match what's stored in bookings
