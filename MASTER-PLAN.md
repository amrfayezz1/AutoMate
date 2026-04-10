# AutoMate — Master Plan

> Internal engineering doc. Single source of truth for what we're building, why, and in what order.

---

## The App in One Sentence

AutoMate helps car owners log maintenance, track documents, and stay on top of what's due — before it becomes overdue.

---

## POC-First Mindset

We are building an MVP as a proof of concept. The goal is to validate the core loop with real users before adding anything else. Ship fast, learn fast, extend only what users actually need.

**The core loop that must work before anything else:**

1. User adds a car
2. User logs a maintenance record
3. App calculates next due date / km
4. Home dashboard shows what's due next, sorted by urgency
5. Reminder fires before it goes overdue

Everything else — documents, mileage log, settings, RTL, polish — supports this loop. If the loop doesn't work, nothing else matters.

---

## MVP Scope

### Shipping in v1

- Auth: email/password, Google, Apple Sign-In
- Onboarding: add first car + optional baseline maintenance seeding
- Maintenance: log records, calculate next due, view upcoming + history
- Home dashboard: urgency-sorted due items, quick actions, activity feed
- Push reminders: notify before service is due (via Edge Function cron)
- Document tracking: insurance, registration, inspection — with expiry alerts
- Mileage log: odometer updates + history + km-based urgency scoring
- Settings: profile, manage cars, language (EN/AR), theme (dark/light/system)
- Full RTL Arabic support on all screens
- 3 screen states on every data screen: loading skeleton, empty, error/offline

## Tech Stack

| Tool                       | Role                                 | Why                                                      |
| -------------------------- | ------------------------------------ | -------------------------------------------------------- |
| React Native + Expo SDK 52 | App framework                        | One codebase, iOS + Android, OTA updates                 |
| TypeScript (strict)        | Language                             | Catches bugs at compile time                             |
| Expo Router v4             | Navigation                           | File-based routing, deep links, typed routes             |
| NativeWind v4              | Styling                              | Tailwind class names — familiar, consistent              |
| Supabase                   | Auth + DB + Storage + Edge Functions | One service replaces 4, generous free tier               |
| TanStack Query v5          | Server state                         | Caching, background refetch, loading states              |
| Zustand v5                 | UI state                             | Active car, theme, language, modal visibility            |
| React Hook Form + Zod      | Forms + validation                   | Type-safe schemas, declarative errors                    |
| Expo Notifications         | Push notifications                   | iOS + Android token management                           |
| Resend                     | Transactional email                  | Password reset, better deliverability than Supabase SMTP |
| Sentry                     | Crash reporting                      | Catch production errors before users report them         |
| EAS                        | Builds + OTA                         | Managed CI for store builds, JS-only OTA updates         |

---

## Database Tables

All tables have RLS enabled. Users can only access their own data.

| Table                 | Purpose                                                            |
| --------------------- | ------------------------------------------------------------------ |
| `profiles`            | User info, preferences (language, theme, notification settings)    |
| `cars`                | Car details, current odometer, tracking mode                       |
| `maintenance_types`   | Predefined + custom types (Oil, Tires, Battery, etc.)              |
| `maintenance_records` | Service history — one row per service event, with next_due_date/km |
| `reminders`           | Per-car reminders linked to maintenance types or documents         |
| `documents`           | Car documents with expiry dates and file uploads                   |
| `odometer_logs`       | History of odometer readings                                       |

Full schema SQL is in `supabase/migrations/`.

---

## Key Business Logic

### Next Due Calculation

Lives in `utils/maintenance.utils.ts` — pure function, unit-testable, no side effects.

```
calculateNextDue(servicedAt, mileageAt, typeIntervalDays, typeIntervalKm, trackingMode)
→ { nextDueDate, nextDueKm }

trackingMode:
  'time'    → nextDueDate only
  'mileage' → nextDueKm only
  'both'    → both; whichever comes first triggers the reminder
```

### Status Colors

- **Red** (overdue): past due date OR past due km
- **Amber** (due soon): within 7 days OR within threshold_km
- **Green** (ok): everything else

### Urgency Scoring (for sorting Upcoming list)

```
urgency_score = days_until_due  (negative = overdue = highest priority)
km-based: convert to days using avg_daily_km = (current_odometer - first_odometer) / days_since_first_log
```

---

## Build Phases

### Phase 0 — Foundation (Week 1)

Goal: Repo compiles. Team can work in parallel. No features.

- [x] Init Expo project, install full stack
- [x] Create Supabase project, run schema migration, seed maintenance types
- [x] Configure Supabase Auth (email, Google, Apple) + deep link scheme `automate://`
- [x] Configure Resend for auth emails
- [x] Init Sentry
- [x] Set up EAS build profiles (dev, preview, production)
- [x] Set up GitHub Actions: lint + type-check on PR
- [x] Build base UI components: Button, Input, Card, Badge, Skeleton, Toast, EmptyState, ErrorState, BottomSheet
- [x] Configure i18n: EN + AR JSON, RTL detection
- [x] Generate Supabase TypeScript types

**Done when:** `npx expo start` works. All tables visible in Supabase dashboard. CI passes.

---

### Phase 1 — Auth + Car Setup (Weeks 2–3)

Goal: User can sign up, add a car, land on a stub home screen.

- [ ] Auth screens: Login, Sign Up, Forgot Password, Reset Password
- [ ] Supabase Auth integration (email + Google + Apple)
- [ ] `authStore`: session, profile, signOut
- [ ] Deep link handler for password reset
- [ ] Auth gate in root `_layout.tsx`
- [ ] Welcome screen + Add Car Step 1 (Make, Model, Year, Plate, Odometer)
- [ ] Add Car Step 2 (tracking mode + optional baseline maintenance)
- [ ] On car creation: seed from baseline OR defaults from car year
- [ ] `carStore`: active car ID persisted to AsyncStorage
- [ ] Push notification permission request
- [ ] Stub home screen

**Done when:** Full auth + onboarding flow works end-to-end. Data visible in Supabase.

---

### Phase 2 — Maintenance Core + Dashboard (Weeks 3–4)

Goal: The core loop works.

- [ ] `useMaintenanceRecords` + `useMaintenanceTypes` hooks
- [ ] Maintenance Overview screen (Upcoming + History tabs)
- [ ] Maintenance Type Selector modal (grid + search + custom type)
- [ ] Add / Log Maintenance form (all fields, photo upload, next-due preview)
- [ ] `calculateNextDue` utility + unit tests
- [ ] On save: compute + store next_due_date/km, update car odometer if needed
- [ ] Maintenance Detail screen (view + edit + delete)
- [ ] Home Dashboard: Next Due hero card, upcoming chips, quick actions, activity feed, monthly spend
- [ ] Mark Complete modal (fast-path from dashboard)
- [ ] Switch Car modal
- [ ] Loading skeletons + empty states for all maintenance screens

**Done when:** Add car → log maintenance → see what's due next → mark complete.

---

### Phase 3 — Reminders (Week 5)

Goal: Users get push notifications before service is due.

- [ ] Register Expo push token, save to `profiles.expo_push_token`
- [ ] `useReminders` hook (CRUD)
- [ ] Reminders List screen (maintenance + document tabs)
- [ ] Add / Edit Reminder form
- [ ] Snooze modal
- [ ] Supabase Edge Function: `check-due-reminders` — daily cron, queries active reminders, sends push via Expo Push API
- [ ] Document expiry check in same Edge Function
- [ ] WhatsApp: mark as "Coming Soon" in UI, do not implement

**Done when:** User receives a push notification when a service is approaching.

---

### Phase 4 — Documents + Mileage (Week 6)

Goal: Documents tracked. Odometer current.

- [ ] `useDocuments` hook (CRUD)
- [ ] Documents List (Active / Expired tabs)
- [ ] Add / Edit Document form (file upload to Supabase Storage)
- [ ] Document Detail (file preview, renew action)
- [ ] Update Mileage modal (validate ≥ current, warn on large jumps)
- [ ] `useOdometerLog` hook
- [ ] Mileage Log screen (list + sparkline)
- [ ] Wire mileage into urgency scoring after each update

**Done when:** Documents tracked with expiry dates. Mileage updates feed km-based reminders.

---

### Phase 5 — Settings + Polish (Week 7)

Goal: App feels complete, not like a prototype.

- [ ] Settings Home, Edit Profile, Notification Preferences, Language & Theme, My Cars
- [ ] Avatar + document file upload via Supabase Storage
- [ ] Unique empty state copy + illustration per screen
- [ ] All loading states use skeletons, no spinners
- [ ] Offline banner (TanStack Query `useNetworkMode` + `expo-network`)
- [ ] Global Toast system (success, error, info)
- [ ] Haptic feedback on key actions
- [ ] Translate all strings to Arabic. Verify RTL on all 31 screens.

**Done when:** Both languages work. Every edge case handled. No spinners.

---

### Phase 6 — QA + Launch (Week 8)

Goal: Ship.

- [ ] End-to-end test all flows on physical iOS + Android devices
- [ ] Test offline behavior
- [ ] Test RTL on Arabic on real device
- [ ] Verify Sentry receives errors from production build
- [ ] FlatList performance with 50+ records (`removeClippedSubviews`, `getItemLayout`)
- [ ] EAS production build: `eas build --profile production --platform all`
- [ ] App Store Connect: screenshots, description (EN + AR), privacy policy, category
- [ ] Google Play Console: same assets
- [ ] Submit for review

---

## Timeline

| Phase     | Focus                        | Duration                                   |
| --------- | ---------------------------- | ------------------------------------------ |
| 0         | Foundation                   | 1 week                                     |
| 1         | Auth + Car setup             | 1.5 weeks                                  |
| 2         | Maintenance core + Dashboard | 2 weeks                                    |
| 3         | Reminders                    | 1 week                                     |
| 4         | Documents + Mileage          | 1 week                                     |
| 5         | Settings + Polish            | 1 week                                     |
| 6         | QA + Launch                  | 1 week                                     |
| **Total** |                              | **~8–9 weeks (team) / 10–12 weeks (solo)** |

---

## Conventions

### Code

- Named functional exports only — no default exports, no classes
- All Supabase queries through `services/` — never called directly from a component or hook body
- TanStack Query keys via factory in `constants/queryKeys.ts`
- No barrel `index.ts` files (degrades Expo bundler performance)
- File names: `PascalCase` for components, `camelCase` for hooks/utils/services

### Git

- Branch: `feat/maintenance-form`, `fix/mileage-validation`, `chore/update-deps`
- Commits: conventional format — `feat:`, `fix:`, `chore:`, `docs:`
- PRs: lint + type-check must pass

### Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SENTRY_DSN=
# In Supabase secrets only (never in app bundle):
RESEND_API_KEY=
```

---
