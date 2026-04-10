# AutoMate

A mobile app for car owners to track maintenance, documents, and mileage — and get reminded before things go overdue.

Built with React Native + Expo. Targets iOS and Android from a single codebase.

---

## What it does

- Log maintenance (oil change, brakes, tires, etc.) and see when you're next due
- Track car documents (insurance, registration, inspection) with expiry alerts
- Keep your odometer current and get km-based reminders
- Push notifications before services are overdue
- Supports English and Arabic (RTL)

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript (strict) |
| Navigation | Expo Router v4 |
| Styling | NativeWind v4 (Tailwind for RN) |
| Backend | Supabase (Auth, PostgreSQL, Storage, Edge Functions) |
| Server state | TanStack Query v5 |
| UI state | Zustand v5 |
| Forms | React Hook Form + Zod |
| Push notifications | Expo Notifications |
| Email | Resend |
| Crash reporting | Sentry |
| Builds | Expo EAS |

---

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account (for password reset emails)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd automate
npm install

# Copy env file
cp .env.example .env.local
```

Fill in `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENTRY_DSN=your_sentry_dsn
```

> `RESEND_API_KEY` lives in Supabase secrets (Edge Functions), not in the app.

### Database

Run the migration in `supabase/migrations/` against your Supabase project:

```bash
npx supabase db push
```

Seed the predefined maintenance types (Oil, Tires, Battery, Brakes, Air Filter, etc.) — seed file is in `supabase/migrations/`.

### Run

```bash
npx expo start
```

Use Expo Go or a simulator. For a full build (push notifications, deep links), use EAS:

```bash
eas build --profile development --platform ios
```

---

## Project Structure

```
automate/
├── app/                  # Expo Router screens
│   ├── (auth)/           # Login, signup, forgot/reset password
│   ├── (onboarding)/     # Welcome + add first car (2 steps)
│   └── (tabs)/           # Main app — Home, Maintenance, Reminders, Settings
├── components/           # UI components (ui/, maintenance/, reminders/, etc.)
├── hooks/                # TanStack Query hooks (useCars, useMaintenanceRecords, etc.)
├── services/             # Supabase calls — all DB access goes through here
├── stores/               # Zustand stores (auth, active car, UI)
├── utils/                # Pure functions (next-due calculation, date, format)
├── constants/            # Maintenance types, intervals, query keys
├── locales/              # en.json, ar.json
├── supabase/
│   ├── migrations/       # SQL schema files
│   └── functions/        # Edge Functions (reminders cron, doc expiry check)
└── types/                # DB types (auto-generated) + app-level types
```

---

## Key Rules

- All Supabase queries go through `services/` — never called directly from components
- Every data screen has three states: loading skeleton, empty, error/offline
- Dark-mode first. Accent color: amber. Status: green / amber / red
- RTL Arabic is required on all screens
- No barrel `index.ts` files (Expo bundler performance)

---

## More Details

See [MASTER-PLAN.md](MASTER-PLAN.md) for the full build plan, phase breakdown, and scope decisions.
