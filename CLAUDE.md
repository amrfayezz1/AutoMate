# AutoMate — Claude Instructions

## Project overview

AutoMate is a car maintenance tracking mobile app. Drivers add their cars, log services (oil change, tire rotation, etc.), get mileage-based reminders, and track monthly spend. The product is a single dark-mode-first React Native / Expo app targeting iPhone. There is no web surface, no marketing site.

**Stack:** React Native · Expo SDK 54 · Expo Router v4 · TypeScript (strict) · NativeWind v4 · Supabase · TanStack Query v5 · Zustand v5 · React Hook Form + Zod · i18next (English + Arabic RTL)

---

## Design system

All design decisions must follow the AutoMate design system. The full spec lives in `design-system/project/`. Read it before implementing any screen or component.

### Quick-reference: color tokens (Tailwind classes)

| Purpose | Class |
|---------|-------|
| Page background | `bg-surface-0` |
| Primary cards | `bg-surface-2` |
| Sheet / modal fill | `bg-surface-3` |
| Chips, icon backplates | `bg-surface-4` |
| Input field background | `bg-surface-1` |
| Brand (blue CTA) | `bg-brand` / `text-brand` |
| Warning / next-due | `bg-warn` / `text-warn` |
| Overdue / destructive | `bg-danger` / `text-danger` |
| Success / completed | `bg-success` / `text-success` |
| Primary text | `text-fg-1` |
| Secondary text | `text-fg-2` |
| Placeholder / disabled | `text-fg-muted` |
| Text on brand button | `text-fg-on-brand` |
| Status fill (card bg) | `bg-{warn\|danger\|success\|brand}-20` |
| Status backplate (icon) | `bg-{warn\|danger\|success\|brand}-30` |

### Quick-reference: shape & spacing

| Token | Class | Value |
|-------|-------|-------|
| Card radius | `rounded-card` | 16px |
| Sheet top radius | `rounded-t-sheet` | 24px |
| Pill / chip | `rounded-pill` | 9999px |
| Screen gutter | `px-4` | 16px |
| Inter-card gap (list) | `gap-3` | 12px |
| Inter-card gap (section) | `gap-4` | 16px |
| Card padding | `p-4` | 16px |
| Summary card padding | `p-6` | 24px |

### Typography rules

- **Family:** `font-sans` = Montserrat 400 Regular · `font-medium` = Montserrat 500 Medium. No other weights.
- **Size scale only:** `text-xs` (12) · `text-sm` (14) · `text-base` (16) · `text-lg` (18) · `text-xl` (20) · `text-2xl` (24). Nothing outside this scale.
- Screen titles and card headers: `text-lg font-medium` or `text-xl font-medium`.
- Body / description: `text-sm` or `text-base font-sans`.
- Labels above inputs: `text-sm font-medium text-fg-2`.
- Muted hints: `text-xs text-fg-muted`.
- Numeric values (mileage, currency): add `font-variant-numeric: tabular-nums` via inline style if the value changes dynamically.

### Motion rules

- Press states: `active:opacity-95`. No scale, no ripple.
- Bottom-sheet open/close: 220ms `Animated.timing`, `useNativeDriver: true`.
- Tab switches: instant. No slide animation between tabs.
- Number values: do not animate.

### Icons

Use **Lucide** icons only (`lucide-react-native`). Stroke width: `2.25`. Size: `20` (optical) inside a `24` frame. Every icon must sit inside a circular backplate sized 32 / 36 / 40 / 48px, colored with the appropriate `-30` alpha token.

Common mappings:
- Home tab → `House`
- Maintenance tab → `Route`
- Reminders tab → `Calendar`
- Settings tab → `Settings`
- Switch car → `ArrowDownUp`
- Delete → `Trash2`
- Edit → `Pencil`
- Oil change → `Wrench`
- Mileage → `Gauge`
- Add → `Plus`
- Dropdown → `ChevronDown`
- Notifications → `Bell`

**Never use emoji as icons in the UI.**

### Borders

Only use borders to communicate state, never decoration:
- Next-Due card: `border-[1.5px] border-warn`
- Selected car in modal: `border border-brand`
- Photo upload zone (empty): `border border-dashed border-surface-4`
- Generic cards: no border

### Layout

- Status bar inset: 54px top
- Screen gutters: 16px (`px-4`)
- Floating nav bar: `bottom-8` from screen edge, translucent `bg-surface-3/90`
- Content scrolls behind the nav bar — nav bar does NOT push layout up
- Modal scrim: `bg-black/50`

---

## Copy & content rules

- **No emoji** anywhere in production UI copy.
- **No exclamation marks.**
- **No first person** ("we", "I", "our").
- **No marketing language** ("smart", "effortless", "AI-powered").
- **Title Case** for: screen titles, nav items, card headers, button labels, status pills, service names.
- **Sentence case** for: description text, activity feed lines, hints.
- **lowercase** for unit suffixes inside a value: `201,240 km`, `2 days ago`.
- Mileage format: `201,240 km` (comma thousands separator, lowercase `km`).
- Currency format: `342.50 LE` (value first, space, three-letter code — no symbol).
- Date display: `May 8, 2026` (never `05/08/26`).
- Date inputs: `5/5/2026` (numeric, short form).
- Relative time: `2 days ago` · `1 week ago`.
- Required field labels: append ` *` → `Maintenance Type *`.
- Optional field labels: append ` (optional)` → `Notes (optional)`.
- Placeholders are examples, not instructions: `45230` not "Enter mileage".

---

## Component conventions

Always use the components in `components/ui/` before reaching for raw React Native primitives.

| Need | Component |
|------|-----------|
| Pressable action | `<Button>` |
| Content container | `<Card>` or `<PressableCard>` |
| Status indicator | `<Badge>` |
| Text field | `<Input>` |
| Overlay panel | `<BottomSheet>` |
| Loading placeholder | `<Skeleton>` / `<SkeletonCard>` |
| No-data screen | `<EmptyState>` |
| Error screen | `<ErrorState>` |
| Feedback message | `<Toast>` |

When adding a new reusable component, put it in `components/ui/` and follow the same pattern: typed props interface, NativeWind classes using design token names only (no raw hex values, no arbitrary Tailwind values like `bg-[#1A1D24]`).

---

## What to avoid

- Raw hex colors in className or style — use Tailwind token classes instead.
- Arbitrary Tailwind values (`text-[13px]`, `p-[7px]`) — use the defined scale.
- `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` — use `rounded-card`, `rounded-sheet`, or `rounded-pill`.
- `bg-surface` / `bg-surface-elevated` (old names) — use `bg-surface-0` through `bg-surface-4`.
- `bg-primary-*`, `text-primary-*` (old generic names) — use `bg-brand`, `text-brand`.
- `text-white`, `text-gray-*`, `text-slate-*` — use `text-fg-1`, `text-fg-2`, `text-fg-muted`.
- `bg-green-*`, `bg-red-*`, `bg-amber-*` — use `bg-success`, `bg-danger`, `bg-warn`.
- Font weights other than 400 (`font-sans`) and 500 (`font-medium`).
- Shadows on cards — elevation is expressed through fill lightness only.
- `font-semibold`, `font-bold` — not part of the design system.
- Scale animations on press — use `active:opacity-95` only.

---

## Design system source files

| File | Contents |
|------|----------|
| `design-system/project/README.md` | Full visual foundations, voice, layout rules |
| `design-system/project/colors_and_type.css` | All CSS custom properties + semantic aliases |
| `design-system/project/ui_kits/mobile_app/tokens.js` | JS token object (`window.AM`) |
| `design-system/project/ui_kits/mobile_app/Primitives.jsx` | Reference: Icon, Backplate, Pill, Card |
| `design-system/project/ui_kits/mobile_app/Screens.jsx` | Reference: 5 full screen implementations |
| `design-system/project/preview/*.html` | Visual reference for each component category |
| `tailwind.config.js` | Tailwind token definitions (source of truth for class names) |
| `global.css` | CSS custom properties loaded in app |
