# Testing

Manual test checklists per critical flow. Verify these before marking any task complete that touches the relevant flow.

---

## Flow 1 — Onboarding / Auth

### Sign Up (new user)

- [ ] Navigate to app → redirected to `/onboarding/phone`
- [ ] Enter an invalid number (e.g. `1234`) → Send Code button stays disabled
- [ ] Enter a valid PH number (e.g. `09171234567`) → Send Code button enables
- [ ] Tap Send Code → navigates to `/onboarding/otp`
- [ ] OTP screen shows the E.164 number (e.g. `+639171234567`)
- [ ] Enter wrong 6 digits → error "Invalid code. Please try again." → input clears
- [ ] Countdown shows 30s then "Resend Code" link appears
- [ ] Enter correct OTP (or test OTP `123456`) → navigates to `/onboarding/profile`
- [ ] Enter name (1 char) → Let's Go button stays disabled
- [ ] Enter name (2+ chars) → Let's Go enables
- [ ] Tap Let's Go → navigates to `/` (Role Select)
- [ ] Role Select shows user's name in top-right corner

### Sign In (returning user with profile)

- [ ] Sign out → back to `/onboarding/phone`
- [ ] Enter same number → OTP → verify → lands directly on `/` (skips profile screen)
- [ ] Name still shows in Role Select header

### Auth Guard

- [ ] While logged out, navigate directly to `/driver/map` → redirected to `/onboarding/phone`
- [ ] While logged out, navigate to `/owner` → redirected
- [ ] While logged out, navigate to `/enforcer` → redirected
- [ ] After sign-in, protected routes are accessible

### Sign Out

- [ ] Tap "Sign out" on Role Select → redirects to `/onboarding/phone`
- [ ] Navigating back to `/` redirects to onboarding (session cleared)

---

## Flow 2 — Driver (Find and Book)

- [ ] Select "Driver" on Role Select → `/driver/map` loads
- [ ] Map centers on Lucena City (13.938°N, 121.617°E)
- [ ] 15 pins visible: green (8), yellow (4), red (3)
- [ ] Legend shows green/yellow/red labels
- [ ] Bottom bar shows count of available green spots
- [ ] Tap green pin → bottom sheet appears with spot name, rate, slots, vehicle type, zone badge
- [ ] Tap yellow pin → sheet shows "Time Restrictions Apply" (no book button)
- [ ] Tap red pin → sheet shows "No Parking Zone" (no book button)
- [ ] Tap green pin with 0 slots (spot-008, Commercial District Lot B) → "Lot Full"
- [ ] Tap "Book This Spot" on a bookable green spot → `/driver/spot`
- [ ] BookingScreen shows spot name, address, rate
- [ ] Duration buttons: 1h, 2h, 3h, 4h — tap to select, total updates
- [ ] Plate input < 6 chars → Continue button disabled
- [ ] Plate input ≥ 6 chars → Continue enables
- [ ] Vehicle type buttons respect spot restriction (motorcycle-only spot disables Car button)
- [ ] Tap "Continue to Payment" → `/driver/payment`
- [ ] Payment screen shows booking summary and GCash/Maya/Cash cards
- [ ] Select payment method → card highlights
- [ ] Tap "Confirm Booking" → loading → `/driver/confirmed`
- [ ] Confirmed screen shows PS-XXXX reference, spot, plate, session end time, total
- [ ] "Back to Map" → returns to `/driver/map`

---

## Flow 3 — Space Owner

- [ ] Select "Space Owner" → `/owner`
- [ ] Dashboard shows total earnings card (black) and 3 spots (spot-001, 002, 003)
- [ ] Each spot shows earnings, bookings count, rate, slots
- [ ] Tap "View All Bookings" → `/owner/bookings`
- [ ] Bookings screen shows active and completed sections
- [ ] Each booking shows plate, reference, duration, payment method, amount
- [ ] Back → `/owner`
- [ ] Tap "+ List a New Space" → `/owner/list`
- [ ] Fill in name and address → remaining fields required before Submit enables
- [ ] Select barangay from dropdown
- [ ] Set rate and slots
- [ ] Choose vehicle type (both/car/motorcycle toggle)
- [ ] Set hours (from/to dropdowns)
- [ ] Tap Submit → loading → success screen with check circle
- [ ] Back to Dashboard → new spot appears in list

---

## Flow 4 — Enforcer (Plate Check)

- [ ] Select "Enforcer" → `/enforcer`
- [ ] Header shows "ENFORCER PORTAL"
- [ ] Input < 5 chars → Check Plate button disabled
- [ ] Type `ABC 1234` → green result card
  - [ ] Shows "STATUS — LEGALLY PARKED"
  - [ ] Shows reference `PS-2841`
  - [ ] Shows location "Quezon Ave Private Lot A"
  - [ ] Shows minutes remaining (positive number if checked within booking window)
  - [ ] Shows payment method "GCASH"
  - [ ] Shows "MOVE ON — vehicle is legally parked"
- [ ] Type `XYZ 5678` → green card (PS-3317)
- [ ] Type `DEF 7890` → green card (PS-5521)
- [ ] Type `LMN 9999` → green card (PS-4102)
- [ ] Type `UNKNOWN123` → red result card
  - [ ] Shows "STATUS — NOT FOUND"
  - [ ] Shows "Issue Citation if Applicable"
- [ ] Tap "Check another plate" → input and result clear
- [ ] Plate input auto-uppercases
- [ ] "Switch role" → `/`

---

## Edge Cases to Always Check

- [ ] Refresh on any protected screen → auth re-resolved, stays on same screen (not redirected)
- [ ] Refresh on `/driver/spot` without booking store data → spot is null, may crash → **known gap, not blocking for prototype**
- [ ] Both Inter and DM Mono fonts load (check Network tab for 0 font errors)
- [ ] On mobile viewport (375px) — all screens usable without horizontal scroll
