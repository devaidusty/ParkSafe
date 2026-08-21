# DB Change Protocol

## Checklist Before Any DB Mutation

- [ ] Read `docs/db-schema.md` — understand every column and FK involved
- [ ] Read `docs/rollback.md` — write the reverse SQL before applying the migration
- [ ] Identify all files that hardcode enum values or column names that will change
- [ ] Apply migration in Supabase SQL Editor (or via MCP `apply_migration` tool)
- [ ] Update `docs/db-schema.md` immediately after — a migration without a schema update is incomplete
- [ ] Add a CHG entry in `docs/changelog.md` with type "Config (Supabase)"
- [ ] Test the affected flow manually against the checklist in `docs/testing.md`

## Critical Columns — Think Twice Before Changing

| Column | Table | Risk |
|---|---|---|
| `profiles.id` | profiles | FK to `auth.users(id)` — changing type breaks all auth |
| `profiles.phone` | profiles | Used in `ProfileScreen.tsx` display and OTPScreen state |
| `profiles.full_name` | profiles | Displayed in `RoleSelectScreen.tsx` header |

## Files That Hardcode Enum / Status Strings

These files contain string literals that must be updated if the corresponding DB column changes:

| File | Hardcoded values |
|---|---|
| `src/types/index.ts` | `ZoneType`, `VehicleType`, `PaymentMethod`, `BookingStatus` |
| `src/data/mock-spots.ts` | `type: 'green'/'yellow'/'red'`, `vehicleTypes: 'both'/'car'/'motorcycle'` |
| `src/data/mock-bookings.ts` | `status: 'active'/'completed'`, `paymentMethod: 'gcash'/'maya'/'cash'` |
| `src/services/enforcer.service.ts` | `b.status === 'active'` |
| `src/services/owners.service.ts` | `b.spotId === s.id` filter |
| `src/screens/driver/MapScreen.tsx` | `s.type === 'green'` checks |

## RLS Rule

After any new table: **always enable RLS immediately and add policies before testing**. A table without RLS is fully public to anyone with the anon key.

```sql
alter table public.new_table enable row level security;
-- Add policies before any data goes in
```
