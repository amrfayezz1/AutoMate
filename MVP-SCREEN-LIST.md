# AutoMate — MVP Screen List

> Source of truth for Figma design. Every screen here ships in v1. Nothing else does.
> Last updated: March 2026

---

## Design System Rules (Apply to All Screens)

- **Color palette**: Dark-mode first. Accent = amber/yellow. Status colors: green (ok), amber (due soon), red (overdue).
- **Maintenance type colors**: Oil = #F59E0B, Tires = #6B7280, Battery = #3B82F6, Brakes = #EF4444, Filter = #10B981, Custom = #8B5CF6
- **Typography**: Single font family. Bold for headings, regular for body, medium for labels.
- **RTL support**: All screens must have a mirrored RTL variant (Arabic). Design in LTR first, flag all directional elements.
- **Screen states**: Every data screen requires 3 variants — loading (skeleton), empty, error/offline.
- **Spacing system**: 4pt base grid. Consistent padding: 16px horizontal, 24px section gaps.
- **Bottom nav**: 4 tabs — Home, Maintenance, Reminders, Settings.

---

## Section 1 — Authentication (5 screens)

| #     | Screen          | Description                                                                                                                                                         | Key Elements                                                                                             |
| ----- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **1** | Splash          | App logo centered on dark background. 1.5s delay, auto-navigates to Login. No skip.                                                                                 | Logo, subtle pulse animation, version number                                                             |
| **2** | Login           | Primary entry point. Email/password. Google Sign-In button. Apple Sign-In button (required for iOS). "Forgot password?" link below password field. Link to Sign Up. | Email input, password input (toggle visibility), Google btn, Apple btn, "Don't have an account? Sign up" |
| **3** | Sign Up         | Name, email, password, confirm password. Inline Zod validation. On success → Welcome screen (onboarding gate).                                                      | 4 fields, password strength indicator, "Already have an account? Log in"                                 |
| **4** | Forgot Password | Single email input. User enters email → receives reset link. Confirm message shown after submit.                                                                    | Email input, submit CTA, success state ("Check your inbox")                                              |
| **5** | Reset Password  | Opened via deep link from email. New password + confirm. On success → redirect to Login with toast.                                                                 | 2 password fields, submit CTA, validation                                                                |

---

## Section 2 — Onboarding / Car Setup (3 screens)

> Only shown to users with 0 cars. After adding first car, never shown again.

| #     | Screen           | Description                                                                                                                                                                                                                                                                                                                                                                                       | Key Elements                                                                                |
| ----- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **6** | Welcome          | First screen after signup for new users. Single value statement. One CTA. No carousel, no fluff.                                                                                                                                                                                                                                                                                                  | App tagline, illustration, "Add Your First Car" CTA, "Skip for now" ghost link              |
| **7** | Add Car — Step 1 | Car identity. Make (searchable dropdown), Model (text or searchable), Year (picker 1990–current), Plate number (text), Current odometer reading. 2-step progress indicator.                                                                                                                                                                                                                       | 5 fields, "Next" CTA, back button, validation                                               |
| **8** | Add Car — Step 2 | Tracking preference + optional baseline. Toggle: Time-based vs Mileage-based reminders. Then a collapsible list of common maintenance types (Oil, Tires, Battery, Brakes, Air Filter) — for each user can optionally enter last done date and/or mileage. Skip buttons per item. "All done, skip rest" at bottom. Explainer text: "This helps us calculate when you're next due. Skip if unsure." | Tracking toggle, baseline list with date+mileage inputs per item, skip per item, finish CTA |

> **Note:** Baseline data in Step 2 is optional but strongly nudged. If skipped entirely, the app seeds defaults from the car's year and generic industry intervals. User is shown a notice: "We've used standard intervals — update them anytime."

---

## Section 3 — Home Dashboard (2 screens)

| #      | Screen           | Description                                                                                                                                                                                                                                                                                                                                                                                                                            | Key Elements                                                                                                   |
| ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **9**  | Home             | The main screen. Top: active car name + plate + quick mileage update icon. Hero card: "Next Due" — most urgent maintenance item (type, days remaining OR km remaining, color-coded status). Below: horizontal scroll of other upcoming items as small chips. Quick Actions row: "+ Log Maintenance", "Update Mileage", "View All". Recent activity feed (last 3 records). Monthly spend summary (simple number, no chart). Bottom nav. | Active car header, hero due card (red/amber/green), upcoming chips, quick actions, activity feed, spend number |
| **10** | Switch Car Modal | Bottom sheet triggered by tapping car name in header. Lists all user's cars with plate + last updated. "Add New Car" option at bottom.                                                                                                                                                                                                                                                                                                 | Car cards with status dot, add car CTA                                                                         |

---

## Section 4 — Maintenance (5 screens)

| #      | Screen                    | Description                                                                                                                                                                                                                                                                                                                     | Key Elements                                                                                           |
| ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **11** | Maintenance Overview      | Two tabs: **Upcoming** (sorted by urgency — overdue first, then soonest) and **History** (chronological, newest first). Each upcoming item shows type icon, name, due date, due km, status badge. Each history item shows type, date, cost, mileage. Filter bar on History tab (by type, date range). FAB: "+ Log Maintenance". | Tab bar, sortable list, status badges, filter controls, FAB                                            |
| **12** | Add / Log Maintenance     | Form: Maintenance type (picker opens Type Selector), Date (defaults to today), Mileage at service, Cost (optional), Provider/shop name (optional), Notes (optional), Photo (optional, 1 photo for MVP). Auto-calculates and shows preview of next due date before save. Save CTA.                                               | Type picker, date picker, numeric inputs, text inputs, photo upload, next-due preview banner, save btn |
| **13** | Maintenance Detail        | Full view of a single record. Shows all fields entered. Edit button (opens same form pre-filled). Delete button (confirmation required). If this is the most recent record for its type, shows "Next Due" banner prominently.                                                                                                   | All record fields, edit/delete actions, next due banner                                                |
| **14** | Maintenance Type Selector | Modal/sheet. Grid of predefined types with icons + color coding. Search bar at top. "Add Custom Type" option at bottom (name + icon pick from preset set + interval).                                                                                                                                                           | Grid of type cards, search, custom type option                                                         |
| **15** | Mark Complete (Modal)     | Quick-complete flow triggered from dashboard's "Next Due" card. Minimal: confirm the type, date defaults to today, mileage input required, cost optional. One tap save.                                                                                                                                                         | Type label (read-only), date, mileage input, cost input, confirm CTA                                   |

---

## Section 5 — Reminders (3 screens)

| #      | Screen              | Description                                                                                                                                                                                                                                | Key Elements                                                                |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **16** | Reminders List      | List of all active + paused reminders for the current car. Two tabs: Maintenance reminders, Document reminders. Each item: name, channel icon (push/WhatsApp), trigger threshold, next trigger time, on/off toggle. FAB: "+ Add Reminder". | Tabbed list, toggle per reminder, status, FAB                               |
| **17** | Add / Edit Reminder | Form: Linked to maintenance type OR document OR custom name. Notification channel(s): Push notification toggle, WhatsApp toggle (shows phone number field if enabled). Threshold: days before due, km before due. Active toggle.           | Type/doc picker, channel toggles, threshold inputs, active toggle, save btn |
| **18** | Snooze Modal        | Bottom sheet when user taps "Snooze" from a notification or reminder. Options: Snooze 3 days, 1 week, 2 weeks, custom date.                                                                                                                | 3 preset options + custom date picker, cancel                               |

---

## Section 6 — Documents (3 screens)

| #      | Screen              | Description                                                                                                                                                                                                              | Key Elements                                                     |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **19** | Documents List      | Grid or list of all documents for the active car. Tabs: Active, Expired. Each card: doc type icon, name, expiry date, days-remaining badge (green/amber/red). FAB: "+ Add Document".                                     | Grid layout, expiry badges, tab filter, FAB                      |
| **20** | Add / Edit Document | Form: Document type (License / Insurance / Inspection / Registration / Other), Name/label, Expiry date (required), Provider (optional), File upload (image or PDF — Supabase Storage), Reminder toggle + threshold days. | Type picker, date picker, file upload, reminder toggle, save btn |
| **21** | Document Detail     | Shows all doc info. Preview thumbnail of uploaded file (tap to full screen). Expiry status banner. "Renew" action = opens edit form with expiry date cleared. Edit + Delete actions.                                     | Doc info, file preview, expiry banner, renew/edit/delete         |

---

## Section 7 — Mileage (2 screens)

| #      | Screen                 | Description                                                                                                                                                                                                                                                | Key Elements                                                 |
| ------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **22** | Update Mileage (Modal) | Quick bottom-sheet modal triggered from dashboard or car header. Current odometer shown. Input new reading. Validates: new value must be ≥ current. Abnormal jump (>30% of expected monthly) shows inline warning but still allows save with confirmation. | Current reading display, input field, jump warning, save btn |
| **23** | Mileage Log            | List of all odometer entries for the active car, newest first. Date + reading + delta (km since last entry). Simple sparkline at top showing trend.                                                                                                        | Chronological list, delta display, sparkline                 |

---

## Section 8 — Settings & Profile (5 screens)

| #      | Screen                   | Description                                                                                                                                                                                                                                         | Key Elements                                                        |
| ------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **24** | Settings Home            | Grouped list. Sections: Profile (name, avatar), My Cars (count badge), Notifications, Language & Theme, Support, About, Sign Out, Delete Account (bottom, destructive color).                                                                       | Grouped list, avatar preview, section headers                       |
| **25** | Edit Profile             | Editable name, email (with re-auth if changed), phone number (for WhatsApp reminders), profile photo (Supabase Storage). Inline validation.                                                                                                         | 4 fields, photo picker, save btn                                    |
| **26** | Notification Preferences | Toggles per channel: Push Notifications (with OS permission request if not granted), WhatsApp (phone number input). Global reminder lead time defaults (e.g., "Remind me X days before due" as a fallback for reminders without custom thresholds). | Channel toggles, default threshold inputs                           |
| **27** | Language & Theme         | Language: English / Arabic (RTL toggle). Theme: System / Light / Dark. Live preview of changes.                                                                                                                                                     | Language picker (2 options), theme picker (3 options), preview area |
| **28** | My Cars                  | Full management screen. List of all cars. Tap to edit. Swipe-to-delete (with confirmation). "Add New Car" CTA. Active car is starred.                                                                                                               | Car list, edit/delete actions, add CTA, active star                 |

---

## Section 9 — System States (3 screen sets)

> These are component-level states, not separate routes. Every data screen implements all three.

| #      | State Type            | Applies To                                                      | Details                                                                                                                               |
| ------ | --------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **29** | Loading / Skeleton    | All list and detail screens                                     | Shimmer placeholders that match the layout of the real content. No spinners.                                                          |
| **30** | Empty State           | Maintenance list, Reminders list, Documents list, Home (no car) | Friendly illustration + one-line message + primary CTA. Each screen has unique copy.                                                  |
| **31** | Error / Offline State | All screens that fetch data                                     | "Something went wrong" with retry button. Offline banner at top of app when no connection detected. Cached data shown when available. |

---

## Screen Count Summary

| Section                | Screens |
| ---------------------- | ------- |
| Authentication         | 5       |
| Onboarding / Car Setup | 3       |
| Home Dashboard         | 2       |
| Maintenance            | 5       |
| Reminders              | 3       |
| Documents              | 3       |
| Mileage                | 2       |
| Settings & Profile     | 5       |
| System States          | 3       |
| **Total**              | **31**  |
