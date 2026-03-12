# AutoMate — Implementation Plan

> From zero to production-ready MVP.
> Audience: engineering team. This is the build bible.

---

## 1. Tech Stack Decision

### Chosen Stack

| Layer              | Tool                  | Version         | Why                                                                                                                                            |
| ------------------ | --------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | React Native + Expo   | SDK 52          | Fastest path to iOS + Android from one codebase. OTA updates via EAS. Best DX in the RN ecosystem.                                             |
| Language           | TypeScript            | 5.x strict mode | Non-negotiable. Catches bugs at compile time, not in production.                                                                               |
| Router             | Expo Router           | v4 (file-based) | Layouts, deep linking, typed routes out of the box. No manual navigator setup.                                                                 |
| Styling            | NativeWind            | v4              | Tailwind CSS for RN. Consistent with web developers' mental model. RTL-friendly with `direction` utility.                                      |
| Server State       | TanStack Query        | v5              | Eliminates 80% of data-fetching boilerplate. Handles caching, background refetch, optimistic updates. Replaces manual Zustand data fetching.   |
| Client/UI State    | Zustand               | v5              | Lightweight. For UI state only: active car selection, modal visibility, theme, language.                                                       |
| Forms              | React Hook Form + Zod | latest          | Type-safe validation. Composable schemas. Errors are declarative, not imperative.                                                              |
| Backend            | Supabase              | latest          | Auth + PostgreSQL + Storage + Edge Functions + Realtime. Generous free tier. TypeScript client with generated types.                           |
| Push Notifications | Expo Notifications    | SDK 52          | Handles iOS + Android token management. Integrates with Supabase Edge Functions for scheduled delivery.                                        |
| Email              | Resend                | latest          | Dead-simple transactional email API. Far better deliverability than Supabase's built-in SMTP. Use for: password reset, document expiry alerts. |
| Error Tracking     | Sentry                | free tier       | Catch crashes in production before users report them. Session replay for RN on paid tier later.                                                |
| Analytics          | PostHog               | free tier       | Product analytics. Understand which screens users actually use. Self-hostable later if needed.                                                 |
| Builds / OTA       | Expo EAS              | free/paid       | Managed CI/CD for iOS and Android builds. OTA updates to bypass app store review for JS changes.                                               |
| CI                 | GitHub Actions        | free            | Lint + type check on every PR. Trigger EAS builds on merge to main.                                                                            |

### What We're NOT using (and why)

- **Firebase**: Vendor lock-in. Supabase gives us a real PostgreSQL database we own.
- **Redux / Redux Toolkit**: Overkill. TanStack Query handles server state; Zustand handles the rest.
- **Styled Components / StyleSheet**: NativeWind is faster and more consistent.
- **REST custom API / Express**: Supabase Edge Functions handle any custom logic. No need to maintain a separate server.
- **RevenueCat**: Not needed for MVP — no monetization in v1.

---

## 2. Project Structure

```
automate/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout: QueryClientProvider, Zustand, Sentry, i18n
│   ├── (auth)/                   # Auth group — no bottom nav
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── (onboarding)/             # Onboarding group — no bottom nav
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   └── setup/
│   │       ├── step1.tsx
│   │       └── step2.tsx
│   └── (tabs)/                   # Main app — with bottom nav
│       ├── _layout.tsx           # Tab bar config
│       ├── index.tsx             # Home dashboard
│       ├── maintenance/
│       │   ├── index.tsx         # Maintenance overview
│       │   ├── add.tsx           # Add/edit maintenance record
│       │   └── [id].tsx          # Maintenance detail
│       ├── reminders/
│       │   ├── index.tsx         # Reminders list
│       │   └── [id].tsx          # Add/edit reminder
│       └── settings/
│           ├── index.tsx         # Settings home
│           ├── profile.tsx       # Edit profile
│           ├── notifications.tsx # Notification preferences
│           ├── language.tsx      # Language & theme
│           └── cars/
│               ├── index.tsx     # My cars list
│               └── [id].tsx      # Edit car
│
├── components/
│   ├── ui/                       # Atomic components (no business logic)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   ├── maintenance/
│   │   ├── MaintenanceCard.tsx
│   │   ├── MaintenanceTypeGrid.tsx
│   │   ├── NextDueHeroCard.tsx
│   │   └── MarkCompleteModal.tsx
│   ├── reminders/
│   │   ├── ReminderCard.tsx
│   │   └── SnoozeModal.tsx
│   ├── documents/
│   │   ├── DocumentCard.tsx
│   │   └── ExpiryBadge.tsx
│   ├── car/
│   │   ├── CarCard.tsx
│   │   ├── SwitchCarModal.tsx
│   │   └── UpdateMileageModal.tsx
│   └── home/
│       ├── QuickActionsRow.tsx
│       └── ActivityFeed.tsx
│
├── hooks/                        # TanStack Query hooks
│   ├── useCars.ts
│   ├── useMaintenanceRecords.ts
│   ├── useMaintenanceTypes.ts
│   ├── useReminders.ts
│   ├── useDocuments.ts
│   ├── useOdometerLog.ts
│   └── useProfile.ts
│
├── services/                     # Supabase calls (pure functions, no hooks)
│   ├── cars.service.ts
│   ├── maintenance.service.ts
│   ├── reminders.service.ts
│   ├── documents.service.ts
│   ├── odometer.service.ts
│   └── profile.service.ts
│
├── stores/                       # Zustand (client/UI state only)
│   ├── authStore.ts              # User session, profile
│   ├── carStore.ts               # Active car ID
│   └── uiStore.ts                # Theme, language, modal state
│
├── lib/
│   ├── supabase.ts               # Supabase client init
│   ├── queryClient.ts            # TanStack QueryClient config
│   ├── notifications.ts          # Expo Notifications setup + token registration
│   ├── sentry.ts                 # Sentry init
│   └── i18n.ts                   # i18next config (EN + AR)
│
├── utils/
│   ├── maintenance.utils.ts      # Next due date calculation logic
│   ├── date.utils.ts
│   ├── mileage.utils.ts
│   └── format.utils.ts           # Currency, distance formatting
│
├── constants/
│   ├── maintenanceTypes.ts       # Predefined types with icons, colors, default intervals
│   ├── intervals.ts              # Standard service intervals by type
│   └── queryKeys.ts              # TanStack Query key factory
│
├── types/
│   ├── database.types.ts         # Auto-generated from Supabase (never edit manually)
│   └── app.types.ts              # App-level types built on top of DB types
│
├── locales/
│   ├── en.json
│   └── ar.json
│
├── supabase/
│   ├── migrations/               # SQL migration files (version controlled)
│   └── functions/                # Edge Functions
│       ├── send-reminder/
│       └── check-expiring-docs/
│
├── .env.local                    # SUPABASE_URL, SUPABASE_ANON_KEY, SENTRY_DSN, RESEND_KEY
├── app.json
├── eas.json                      # EAS build profiles
└── tailwind.config.js
```

---

## 3. Database Schema

> All tables have Row Level Security (RLS) enabled. Users can only access their own data.

```sql
-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
create table profiles (
  id            uuid references auth.users on delete cascade primary key,
  name          text not null,
  avatar_url    text,
  phone         text,                          -- for WhatsApp reminders
  language      text default 'en',             -- 'en' | 'ar'
  theme         text default 'dark',           -- 'dark' | 'light' | 'system'
  notif_push    boolean default true,
  notif_whatsapp boolean default false,
  default_reminder_days int default 7,
  created_at    timestamptz default now()
);

-- ─────────────────────────────────────────
-- CARS
-- ─────────────────────────────────────────
create table cars (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references profiles(id) on delete cascade not null,
  make            text not null,
  model           text not null,
  year            int not null,
  plate           text,
  odometer        int not null default 0,      -- in km
  odometer_updated_at timestamptz default now(),
  tracking_mode   text default 'both',         -- 'time' | 'mileage' | 'both'
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────
-- MAINTENANCE TYPES
-- ─────────────────────────────────────────
create table maintenance_types (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid references profiles(id) on delete cascade, -- null = predefined/global
  name                  text not null,
  name_ar               text,
  icon                  text not null,                    -- icon name from preset set
  color                 text not null,                    -- hex
  default_interval_days int,                             -- e.g., 90 for oil change
  default_interval_km   int,                             -- e.g., 5000 for oil change
  is_custom             boolean default false,
  sort_order            int default 0
);

-- Seed: Oil, Tires, Battery, Brakes, Air Filter, Fuel Filter, Transmission, Coolant, Spark Plugs, Wipers

-- ─────────────────────────────────────────
-- MAINTENANCE RECORDS
-- ─────────────────────────────────────────
create table maintenance_records (
  id              uuid default gen_random_uuid() primary key,
  car_id          uuid references cars(id) on delete cascade not null,
  type_id         uuid references maintenance_types(id) not null,
  serviced_at     date not null,
  mileage_at      int not null,                           -- odometer at time of service
  cost            numeric(10,2),
  provider        text,
  notes           text,
  photo_url       text,
  next_due_date   date,                                   -- calculated on save
  next_due_km     int,                                    -- calculated on save
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────
-- REMINDERS
-- ─────────────────────────────────────────
create table reminders (
  id                  uuid default gen_random_uuid() primary key,
  car_id              uuid references cars(id) on delete cascade not null,
  type_id             uuid references maintenance_types(id),  -- null = document reminder or custom
  document_id         uuid references documents(id),
  name                text not null,
  channel_push        boolean default true,
  channel_whatsapp    boolean default false,
  threshold_days      int default 7,                     -- remind X days before due
  threshold_km        int,                               -- remind X km before due
  is_active           boolean default true,
  last_triggered_at   timestamptz,
  created_at          timestamptz default now()
);

-- ─────────────────────────────────────────
-- DOCUMENTS
-- ─────────────────────────────────────────
create table documents (
  id              uuid default gen_random_uuid() primary key,
  car_id          uuid references cars(id) on delete cascade not null,
  doc_type        text not null,                          -- 'license' | 'insurance' | 'inspection' | 'registration' | 'other'
  name            text not null,
  expiry_date     date not null,
  provider        text,
  file_url        text,                                   -- Supabase Storage URL
  reminder_enabled boolean default true,
  reminder_days   int default 30,
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────
-- ODOMETER LOG
-- ─────────────────────────────────────────
create table odometer_logs (
  id          uuid default gen_random_uuid() primary key,
  car_id      uuid references cars(id) on delete cascade not null,
  value       int not null,
  recorded_at timestamptz default now()
);
```

### RLS Policies (pattern for all tables)

```sql
-- Example for cars table (repeat pattern for all tables)
alter table cars enable row level security;

create policy "Users can view their own cars"
  on cars for select using (auth.uid() = user_id);

create policy "Users can insert their own cars"
  on cars for insert with check (auth.uid() = user_id);

create policy "Users can update their own cars"
  on cars for update using (auth.uid() = user_id);

create policy "Users can delete their own cars"
  on cars for delete using (auth.uid() = user_id);
```

---

## 4. Core Business Logic

### Next Due Date Calculation

> Lives in `utils/maintenance.utils.ts`. Pure function, fully testable.

```typescript
interface NextDueResult {
  nextDueDate: Date | null;
  nextDueKm: number | null;
}

function calculateNextDue(params: {
  servicedAt: Date;
  mileageAt: number;
  typeIntervalDays: number | null;
  typeIntervalKm: number | null;
  trackingMode: "time" | "mileage" | "both";
}): NextDueResult;

// Rules:
// - 'time'    → only calculate nextDueDate
// - 'mileage' → only calculate nextDueKm
// - 'both'    → calculate both; whichever comes first triggers the reminder
// - Status:   overdue if past date OR past km (given current odometer)
//             due-soon if within 7 days or within threshold_km
//             ok otherwise
```

### Urgency Scoring (for sorting the Upcoming list)

```
urgency_score = days_until_due (negative if overdue)
If km-based: estimate days using (km_until_due / avg_daily_km)
avg_daily_km = (current_odometer - first_odometer) / days_since_first_log
```

---

## 5. Implementation Phases

### Phase 0 — Foundation (Week 1)

> Goal: Everything compiles. Team can work in parallel. No features yet.

**Tasks:**

- [ ] Init Expo project: `npx create-expo-app automate --template blank-typescript`
- [ ] Install and configure: Expo Router v4, NativeWind v4, TanStack Query v5, Zustand v5
- [ ] Install: React Hook Form, Zod, i18next, react-i18next
- [ ] Create Supabase project. Run full schema migration. Enable RLS on all tables. Seed maintenance types.
- [ ] Configure Supabase Auth: Email/password, Google OAuth, Apple Sign-In. Set deep link scheme: `automate://`
- [ ] Set up Resend account. Configure Supabase to use Resend SMTP for auth emails.
- [ ] Init Sentry project. Add DSN to env.
- [ ] Set up EAS: `eas build:configure`. Create profiles: development, preview, production.
- [ ] Set up GitHub Actions: lint + type-check on PR.
- [ ] Build base UI components: Button, Input, Card, Badge, Skeleton, Toast, EmptyState, ErrorState, BottomSheet.
- [ ] Configure i18n: EN + AR JSON files. RTL detection and NativeWind direction config.
- [ ] Generate Supabase TypeScript types: `npx supabase gen types typescript`
- [ ] Commit folder structure. Everyone aligns.

**Deliverable:** `npx expo start` works. Supabase dashboard shows all tables. CI passes.

---

### Phase 1 — Auth + Car Setup (Weeks 2–3)

> Goal: User can sign up, add a car, and land on a (stub) home screen.

**Tasks:**

- [ ] Auth screens: Login, Sign Up, Forgot Password, Reset Password
- [ ] Supabase Auth integration: email/password, Google, Apple (iOS)
- [ ] `authStore`: session, profile, signOut
- [ ] Deep link handler for password reset (`automate://reset-password`)
- [ ] Auth gate in root `_layout.tsx`: redirect to login if no session, redirect to welcome if no cars
- [ ] Welcome screen
- [ ] Add Car Step 1 form (Make, Model, Year, Plate, Odometer) + validation
- [ ] Add Car Step 2 (tracking mode toggle + baseline maintenance input)
- [ ] On car creation: seed maintenance records from baseline inputs OR generate defaults from car year
- [ ] `carStore`: active car ID, persisted to AsyncStorage
- [ ] Permissions request: push notification permission (Expo Notifications)
- [ ] Stub home screen (just shows car name)

**Deliverable:** Full auth + onboarding flow works end-to-end. Data in Supabase.

---

### Phase 2 — Maintenance Core (Weeks 3–4)

> Goal: The main value of the app — logging and tracking maintenance — works fully.

**Tasks:**

- [ ] `useMaintenanceRecords` hook (TanStack Query): fetch upcoming + history per car
- [ ] `useMaintenanceTypes` hook: fetch predefined + user custom types
- [ ] Maintenance Overview screen (2 tabs: Upcoming sorted by urgency, History)
- [ ] Maintenance Type Selector modal (grid + search + custom type creation)
- [ ] Add Maintenance form: all fields, photo upload to Supabase Storage, next-due preview
- [ ] `calculateNextDue` utility: implement + write unit tests
- [ ] On save: compute next_due_date + next_due_km, save to record, update car's odometer if mileage_at > current
- [ ] Maintenance Detail screen (view + edit + delete)
- [ ] Home Dashboard: wire up Next Due Hero Card with real data, upcoming chips, quick actions, activity feed
- [ ] Mark Complete Modal: fast-path from dashboard
- [ ] Switch Car Modal
- [ ] Loading skeletons and empty states for all maintenance screens

**Deliverable:** Core loop works — add car → log maintenance → see what's due next.

---

### Phase 3 — Reminders (Week 5)

> Goal: Users get notified when maintenance is due.

**Tasks:**

- [ ] Expo Notifications: register device token, save to `profiles.expo_push_token` (add column)
- [ ] `useReminders` hook: CRUD for reminders
- [ ] Reminders List screen (2 tabs: maintenance, documents)
- [ ] Add / Edit Reminder form
- [ ] Snooze Modal
- [ ] Supabase Edge Function: `check-due-reminders` — runs on a cron schedule (daily). Queries all active reminders, computes which ones are triggered (due date within threshold), sends push notification via Expo Push API.
- [ ] WhatsApp channel: save phone number, trigger WhatsApp message via WhatsApp Business API or Twilio (can use simple HTTP call from Edge Function). If too complex, ship push-only for MVP and mark WhatsApp as "Coming Soon" in UI.
- [ ] Document expiry reminder check: same Edge Function checks `documents` table for upcoming expiries.

**Deliverable:** Users receive push notifications when service is approaching.

---

### Phase 4 — Documents + Mileage (Week 6)

> Goal: Car documents tracked. Mileage kept current.

**Tasks:**

- [ ] `useDocuments` hook: CRUD for documents
- [ ] Documents List screen (Active / Expired tabs)
- [ ] Add / Edit Document form (with file upload — image or PDF)
- [ ] Document Detail screen (file preview, renew action)
- [ ] Update Mileage Modal: validate input, save to `odometer_logs`, update `cars.odometer`
- [ ] Mileage Log screen: list of entries + sparkline
- [ ] Wire mileage into urgency scoring: recalculate which km-based reminders are triggered after each update
- [ ] Car Profile page: show car info + current odometer (accessible from My Cars)

**Deliverable:** Users can track documents and keep mileage current.

---

### Phase 5 — Settings + Polish (Week 7)

> Goal: App feels complete, not like a prototype.

**Tasks:**

- [ ] Settings Home screen
- [ ] Edit Profile (name, phone, avatar upload)
- [ ] Notification Preferences screen
- [ ] Language & Theme screen (EN/AR toggle with RTL, light/dark/system theme)
- [ ] My Cars management (edit car, delete car with confirmation)
- [ ] Audit all empty states — unique illustration + copy per screen
- [ ] Audit all loading states — every screen has skeletons, not spinners
- [ ] Offline banner: use TanStack Query's `useNetworkMode` + `expo-network` listener
- [ ] Global Toast system (success, error, info)
- [ ] Haptic feedback on key actions (log maintenance, mark complete)
- [ ] Translate all strings to Arabic. Verify RTL layout on all screens.

**Deliverable:** App is polished, both languages work, all edge cases handled.

---

### Phase 6 — QA + Launch Prep (Week 8)

> Goal: Ship to production.

**Tasks:**

- [ ] End-to-end test all flows: signup → add car → log maintenance → reminder → documents
- [ ] Test on physical iOS and Android devices (not just simulator)
- [ ] Test offline behavior: what shows, what fails gracefully
- [ ] Test RTL on Arabic on real device
- [ ] Verify Sentry is receiving errors from production build
- [ ] Performance: check FlatList performance with 50+ maintenance records (use `removeClippedSubviews`, `getItemLayout`)
- [ ] EAS production build: `eas build --profile production --platform all`
- [ ] App Store Connect: screenshots, description (EN + AR), privacy policy URL, app category
- [ ] Google Play Console: same assets
- [ ] Submit for review

**Deliverable:** App live on App Store and Google Play.

---

## 6. Timeline Summary

| Phase     | Focus               | Duration       | Parallelizable?                       |
| --------- | ------------------- | -------------- | ------------------------------------- |
| 0         | Foundation & setup  | 1 week         | No — everyone needs this              |
| 1         | Auth + Car setup    | 1.5 weeks      | Auth and screens can split            |
| 2         | Maintenance core    | 2 weeks        | UI and business logic can split       |
| 3         | Reminders           | 1 week         | Edge function can be separate from UI |
| 4         | Documents + Mileage | 1 week         | Can parallelize                       |
| 5         | Settings + Polish   | 1 week         | Split by screen                       |
| 6         | QA + Launch         | 1 week         | No                                    |
| **Total** |                     | **~8–9 weeks** |                                       |

> **Solo developer**: 10–12 weeks
> **2-person team**: 7–8 weeks
> **3-person team**: 5–6 weeks (Phase 2 becomes the bottleneck)

---

## 7. Conventions & Rules

### Code conventions

- All components: named exports, functional, no classes
- File names: `PascalCase` for components, `camelCase` for hooks/utils/services
- Directories: `kebab-case`
- No barrel index.ts files (causes slow bundling in Expo)
- Every Supabase query goes through a service function, never called directly from a component
- TanStack Query keys: always use the factory in `constants/queryKeys.ts`

### Git conventions

- Branch naming: `feat/maintenance-form`, `fix/mileage-validation`, `chore/update-deps`
- Commits: conventional commits format (`feat:`, `fix:`, `chore:`, `docs:`)
- PRs require: lint passing, type check passing, at least 1 reviewer

### Env management

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SENTRY_DSN=
RESEND_API_KEY=         # stored in Supabase secrets, not in app
POSTHOG_API_KEY=
```

> Note: `EXPO_PUBLIC_*` prefix is required for Expo to expose env vars to the client bundle.
> Supabase service role key is NEVER in the mobile app — only in Edge Functions
