# Feature: Owner Flow

Space owners list their parking spots and view earnings and bookings.

## Screens and Files

| File | Role |
|---|---|
| `src/screens/owner/OwnerDashboard.tsx` | Earnings summary + spot list |
| `src/screens/owner/ListSpotScreen.tsx` | Form to list a new parking space |
| `src/screens/owner/BookingsScreen.tsx` | List of bookings for owned spots |
| `src/services/owners.service.ts` | Data source — pre-seeds spots 001–003 as "owned" |
| `src/store/owner.store.ts` | Cache for spots and bookings |
| `src/data/mock-spots.ts` | Source of truth for pre-seeded spots |
| `src/data/mock-bookings.ts` | Source of bookings filtered to owned spots |

## Data Flow

```
OwnerDashboard mounts
  → ownerService.getMySpots() → spots 001, 002, 003 with earnings/bookings
  → ownerService.getMyBookings() → bookings for spots 001–003
  → renders earnings total + spot cards

"View All Bookings" → /owner/bookings
  → BookingsScreen reads from ownerService.getMyBookings()
  → splits into active/completed sections

"+ List a New Space" → /owner/list
  → ListSpotScreen: name, address, barangay, rate, slots, vehicleType, hours
  → ownerService.listSpot(data) → new OwnedSpot pushed to in-memory array
  → success screen shown
```

## Inputs (ListSpotScreen)

- `name`: string (required)
- `address`: string (required)
- `barangay`: select from 10 Lucena barangays
- `ratePerHour`: number (₱ per hour)
- `slotsTotal`: number
- `vehicleTypes`: 'both' | 'car' | 'motorcycle' (toggle)
- `hoursOpen`: string composed from "from" and "to" time selects

## BREAK RISK

| If you do this | This breaks |
|---|---|
| Change `OWNER_SPOT_IDS` in owners.service.ts | Different spots show as "owned" — earnings/bookings change |
| Add required field to `OwnedSpot` type | `ownerService.listSpot()` TypeScript error |
| Remove `totalEarnings` / `totalBookings` from `OwnedSpot` | Dashboard earnings card shows undefined |
| Change barangay list in ListSpotScreen | User may submit a barangay that doesn't match future DB enum |

## Dependencies

- `mock-bookings.ts` — earnings calculated by filtering `b.spotId === s.id` for owned spots
- `mock-spots.ts` — spot data for spots 001–003; changing spot IDs breaks pre-seed
- `owner.store.ts` — optional cache layer; currently not used by all screens (some call service directly)
