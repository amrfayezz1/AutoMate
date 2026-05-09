# Post-MVP Features

Items deferred from the MVP audit on 2026-05-09. None are blockers for the demo; all are tracked here so they don't get lost.

---

## 1. Activate i18n (English + Arabic RTL)

**Status:** Setup complete, unused.

**What exists:**
- `locales/en.json` and `locales/ar.json` are populated.
- `lib/i18n.ts` initializes `i18next` + `react-i18next` with `expo-localization` device detection and `I18nManager.forceRTL(isRTL)` for Arabic.

**What's missing:**
- Zero UI strings are wrapped in `t(...)`. Every label, title, button, and error message in `app/` and `components/` is hardcoded English.
- No language switcher surface (intended to live in Settings, which is itself deferred).
- RTL layout has never been smoke-tested with Arabic.

**Work required:**
- Sweep every screen and component, replace literal strings with `t('namespace.key')`.
- Add language switcher to Settings.
- Audit all flex/padding/margin for RTL correctness (icons that imply direction, chevrons, etc.).

---

## 2. Currency preference on profile

**Status:** Hardcoded to `LE` (Egyptian Pound).

**Where:**
- [app/(tabs)/index.tsx:67-69](app/(tabs)/index.tsx#L67-L69) — `formatCurrency` returns `${value} LE` literally.
- The `LE` chip in the Monthly Spend card at [app/(tabs)/index.tsx:154](app/(tabs)/index.tsx#L154).
- `app/maintenance/log.tsx` cost field uses the same assumption.

**Work required:**
- Add a `currency` column to `profiles` (e.g., ISO 4217 three-letter code, default `EGP`).
- Migration to backfill existing rows.
- Read the value via the profile query and thread it through `formatCurrency` and any chip labels.
- Settings screen needs a currency picker.

Acceptable for an Egypt-only MVP; revisit before any market expansion.

---

## 3. Forms migration to react-hook-form + zod

**Status:** Both libraries are installed (`package.json`) but unused. CLAUDE.md prescribes them.

**Affected forms:**
- `app/(auth)/sign-up.tsx`
- `app/(auth)/sign-in.tsx`
- `app/(auth)/verify-email.tsx`
- `app/(auth)/forgot-password.tsx`
- `app/(auth)/add-car/vehicle.tsx`
- `app/(auth)/add-car/tracking.tsx`
- `app/(auth)/add-car/baseline.tsx`
- `app/maintenance/log.tsx`

All currently use manual `useState` + ad-hoc validators with inline error messages. Functional but inconsistent.

**Work required:**
- Define zod schemas per form (probably colocated with the screen, or under `lib/schemas/`).
- Replace `useState` field state with `useForm` + `Controller` around the existing `Input` / `DateField` / `PhotoField` components.
- Surface zod errors via the components' existing `error` prop.
- Decide whether to keep the password strength indicator on sign-up as a separate concern or fold it into the schema.

---

## 4. Add-car flow durability

**Status:** Multi-step state lives in Zustand (`useOnboardingStore`) and only persists to Supabase on the final Baseline step ([app/(auth)/add-car/baseline.tsx:186-228](app/(auth)/add-car/baseline.tsx#L186-L228)).

**Problem:** If the user kills the app on step 2 or 3, all entered data is lost.

**Options:**
- Persist `useOnboardingStore` to AsyncStorage via `zustand/middleware/persist`. Lightest touch.
- Or: write an in-progress `cars` row on step 1 with a `status: 'draft'` column and update it as the user advances. Heavier but lets the flow be resumed across sessions/devices.

Acceptable for MVP since onboarding is short, but worth fixing before we add more steps or any background interruption (push permission prompt, deep-link, etc.).

---

## 5. Reminders feature

**Status:** Removed from MVP. The `(tabs)/reminders.tsx` screen has been deleted; the tab has been removed from the bottom nav.

**Schema is already in place** — `001_initial_schema.sql` defines a `reminders` table with `is_active`, `car_id`, etc., plus an index `reminders_is_active_idx` partial on active rows for an edge-function cron.

**Work required to bring back:**
- Re-add `app/(tabs)/reminders.tsx` and a tab entry in `app/(tabs)/_layout.tsx` and `components/ui/TabBar.tsx`.
- Build a `lib/services/reminders.ts` with list / create / toggle / delete.
- Build the edge function that fans out push notifications based on `reminders_is_active_idx`.
- Hook the existing `expo-notifications` setup (verify it's configured in `app.json`).

---

## 6. Settings screen

**Status:** Stubbed with a "Coming soon" message. The tab is rendered but disabled (50% opacity) and tapping it shows a "Coming soon" toast instead of navigating.

**Implementation in:**
- [components/ui/TabBar.tsx](components/ui/TabBar.tsx) — Settings entry has `disabled: true`.
- [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) — disabled tab presses trigger a Toast; the route is registered with `href: null` so it doesn't show as active.

**Work required when implementing:**
- Remove the `disabled: true` flag from the TabBar entry.
- Drop the `href: null` from the `Tabs.Screen` registration.
- Remove the disabled-press handler from the layout (and `onDisabledTabPress` prop from the TabBar if no other tab needs it).
- Build out the screen itself: profile (name, email, avatar), language switcher (see #1), currency switcher (see #2), sign out, delete account, support.

---

## Audit anchor

These items came out of the 2026-05-09 MVP audit. The four blockers identified there are fixed in the same commit as this document:

1. ~~Two empty "Update Mileage" handlers on Home~~ — wired via `UpdateMileageSheet`.
2. ~~Dead "Add Car" link in `CarSwitcher`~~ — wired to `/(auth)/add-car/vehicle` with onboarding-store reset.
3. ~~Reminders tab stub~~ — removed (this doc, item 5).
4. ~~Settings tab stub~~ — disabled with Coming Soon toast (this doc, item 6).
