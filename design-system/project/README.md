# AutoMate Design System

AutoMate is a **car maintenance tracking mobile app**. Drivers add their cars,
log services as they happen (oil change, tire rotation, brake pads), get
mileage-based reminders for what's due next, and track monthly spend.

The product is a single iPhone-sized native-feeling app. There is no marketing
site, no dashboard, no docs — just the app. The design system reflects that:
**one product, one surface, dark-mode first.**

## Source materials

This system was reconstructed from a Figma file the user attached:

- **Figma file:** `Automate.fig` (mounted as a virtual filesystem during build).
  - 1 page, 17 top-level frames, all hi-fi mobile artboards (402 × 874).
  - Frames cover: Home (default + next-due modal + switch-car modal), Maintenance
    Upcoming (+ filter / sort / details / delete-confirm / alert variants),
    Maintenance History (3 variants), Log Maintenance (3 variants).
  - Components: shared `Frame1000004508` (home dashboard), `SwitchCarModal`,
    `Property1=Home/Maintenance/Reminders/Settings` (nav bar), upcoming &
    history maintenance cards, generic Container, modal Containers.
- **Icons in source:** the file uses **Vuesax / iconsax bold** icons. Some SVG
  geometry was missing in the Figma export, so this system substitutes
  **Lucide** (CDN, same stroke-bold visual weight) and flags the swap below.
- **Fonts in source:** **Montserrat** Medium (500) and Regular (400) only.
  Montserrat is on Google Fonts, so we load it from there directly — no
  binary substitution needed.

## Quick index

```
README.md                  ← this file
SKILL.md                   ← Agent Skills frontmatter for cross-host use
colors_and_type.css        ← raw + semantic CSS variables, base typography
assets/                    ← logos, brand marks, hero illustration
preview/                   ← cards rendered in the Design System tab
ui_kits/
  mobile_app/              ← React (Babel) recreation of the AutoMate app
    index.html             ← interactive click-thru (5 screens)
    *.jsx                  ← components
```

---

## Content fundamentals

The product is **utilitarian, terse, and friendly-but-not-cute.** A driver in a
parking lot needs to log an oil change in 15 seconds. The copy never gets in
their way.

### Voice
- **Direct, no fluff.** "Switch Car." "Save Maintenance." "Add New Car." Imperative
  verbs on every button. No "Let's…", no "Here's your…".
- **Second-person implied, not stated.** Labels read as facts about the car,
  not instructions to the user: *"Current Mileage"*, *"Next Due"*, *"Total This
  Month"*. The user is never addressed as "you".
- **Short.** Most labels are 1–3 words. Card headers are 2 words. Even the empty
  state of a status pill is one word: *"Urgent"*, *"Upcoming"*, *"Overdue"*.
- **Mechanical, slightly technical.** It uses the words a mechanic uses — *Oil
  Change, Tire Rotation, Air Filter, Brake Inspection, Battery Check*. No
  euphemisms ("vehicle wellness", "maintenance journey").

### Casing
- **Title Case for everything that names a thing or an action:** screen titles
  ("Maintenance", "Log Maintenance"), nav items ("Home", "Reminders"),
  card headers ("Recent Activity", "Monthly Spend Summary"), buttons ("Save
  Maintenance"), status pills ("Urgent", "Upcoming"), service names ("Oil
  Change").
- **Sentence case for descriptive sub-text:** *"Oil change completed"*,
  *"Mileage updated to 210,240 km"*, *"Additional details…"*.
- **lowercase only for unit suffixes inside a number/value:** *"500 km left"*,
  *"2 days ago"*, *"1 week ago"*.
- **ALL CAPS is never used.**

### Form copy
- Required fields end in ` *` (space + asterisk): *"Maintenance Type *"*.
- Optional fields say it explicitly in parentheses: *"Cost (optional)"*,
  *"Notes (optional)"*, *"Photo (optional)"*. No mystery — no field ever has
  unexplained optionality.
- Placeholders are **examples, not instructions**: an empty mileage field shows
  `45230`, not "Enter mileage".
- Confirmation hints sit *above* the primary CTA in muted teal:
  *"Next service 5/5/2026"*. The button itself stays terse: *"Save Maintenance"*.

### Numbers, dates, units
- Mileage uses comma thousands and a lowercase unit: `201,240 km`.
- Currency is `342.50 LE` — value first, three-letter code after a space, no
  symbol. (LE = Egyptian Pound; the original Figma had an "Esterling" pound
  glyph icon next to it. Confirm the locale strategy.)
- Dates spell the month: `May 8, 2026`, never `05/08/26`. Date *inputs* are
  the exception — they show numeric `5/5/2026`.
- Relative time for activity: `2 days ago`, `5 days ago`, `1 week ago`.

### What's *not* in the copy
- **No emoji.** Status is communicated with color and an icon, never `🚗` or
  `⚠️`.
- **No exclamation marks.** Even "Urgent" sits in a calm orange pill — the
  product never panics at you.
- **No first person.** Never "we", never "I". The app doesn't have a persona.
- **No marketing language.** No "smart", "AI-powered", "effortless".

---

## Visual foundations

A short version: **deep near-black surface, electric blue accent, all corners
rounded, every elevated thing is a card.**

### Color
- **Background is a single solid color: `#0F1115`** (rgb 15,17,21). Not pure
  black. There are no gradients on the page background, no images, no noise.
- **Three surface elevations on top of background**, each ~3% lighter than the
  last:
  - `#16191F` — input fields, inactive tab buttons.
  - `#1A1D24` — primary cards (activity rows, action buttons, summary panel).
  - `#22262F` — sheet/modal background, elevated nav bar.
  - `#2A2F3A` — pill chips inside a card, icon backplate inside a card.
- **Primary accent is a single saturated blue, `#3A86FF`**. Used for the
  primary CTA fill, the active tab pill, the active nav-bar icon, and small
  blue circular action buttons. No hover-darken or hover-lighten — the design
  is mobile-only, no hover states.
- **Status colors map 1:1 to states:** orange `#FF9F1C` = warning / next-due /
  urgent; red `#E63946` = overdue / destructive; teal `#2EC4B6` = success /
  completed / confirmation hints. Each appears as: solid in icons & numbers,
  20% alpha as card backgrounds, 30% alpha as icon backplates.
- **Text is one of four greys**, never pure white: `#E6E8EC` (primary),
  `#A1A7B3` (secondary), `#B0B6C3` (icon strokes / subtle borders),
  `#6B7280` (placeholder / disabled).

### Type
- **Single family: Montserrat.** Two weights: 400 Regular and 500 Medium. No
  bold (700), no light, no italic.
- **All numerals are tabular by virtue of Montserrat's natural metrics; we
  enforce `font-feature-settings: "tnum" 1` on numeric strings (mileage, prices)
  to prevent jitter when values change.
- **Sizes form a tight 6-step ramp:** 12 / 14 / 16 / 18 / 20 / 24. There is
  no 32px, no 40px hero size — this is a phone app, the biggest thing on
  screen is the monthly total at 24px.

### Spacing
- **8px grid.** All gaps and padding are multiples of 4 most often 8/12/16/24.
- **Card padding is 16px on all four sides.** Larger summary cards bump to
  24px. Nav bar uses 12 / 24 (vertical / horizontal).
- **Inter-card gap is 12px** (lists) or 16px (sections separated by a
  heading).
- **Gutter from screen edge is 16px.** The status bar / home indicator are
  the only chrome that touches 0.

### Corners
- **16px radius on cards, fields, image-shaped buttons.**
- **Pill-shape (full radius) on small status chips, tab buttons, nav bar
  outer container, and circular icon backplates.**
- **24px on the top corners of bottom-sheet modals** (`SwitchCarModal`),
  bottom corners stay at 0 (sheet meets the bottom edge).
- **No 4px or 8px radii. No square corners on anything interactive.**

### Borders
- Borders are used **only to communicate state**, never as decoration.
  - 1.5px solid orange around the Next-Due card.
  - 1px solid blue around the *currently selected* car in the Switch Car
    modal.
  - 1px **dashed** `#2A2F3A` around the empty Photo upload zone.
- Generic cards have **no border at all** — they're separated from the
  background by their lighter fill alone.

### Shadows
- The system uses one soft shadow, only on the floating navigation bar:
  `0 0 15px rgba(0,0,0,0.05)`. Cards do not cast shadows; elevation is
  communicated through fill lightness.
- There are no inner shadows, no glassmorphism, no backdrop blur.

### Backgrounds, imagery, texture
- **No imagery in the product.** No photos, no illustrations, no patterns,
  no noise, no gradients. The car the user owns is represented by a name
  and license plate. (We added a small marketing/illustration set to
  `assets/` to support slides and onboarding *if* the user asks for them —
  the product itself has none.)

### Iconography
- Source uses **Vuesax / iconsax** at the **bold** weight, 24×24 frame, 20×20
  optical size. Every icon sits inside a circular backplate (32 / 36 / 40 /
  48 px) tinted to match its meaning (blue 30%, orange 30%, neutral surface).
- We substitute **Lucide** (`lucide.dev`) at `stroke-width: 2.25` to match the
  bold weight. **Flagged**: the visual match is close (~95%) but not exact;
  if pixel-perfect Vuesax is required, we'll need a Vuesax license / asset
  drop.
- **No emoji ever. No unicode glyphs as icons.**

### Motion
- The Figma file has no prototyped transitions. The implied motion language is:
  - **Tab switches:** instant; the active pill fills with blue, no slide.
  - **Modals:** bottom-sheet slide-up over a `rgba(0,0,0,0.5)` scrim; 220ms,
    `cubic-bezier(0.32, 0.72, 0, 1)` (iOS sheet curve).
  - **Press states:** card / button drops to `0.95` opacity with a 100ms ease.
    No scale-down, no ripple.
- We don't animate numbers, don't animate the gauge. This is a tracker, not a
  toy.

### Layout rules
- The phone artboard is **402 × 874** (iPhone 14/15).
- **Top:** 54px reserved for status bar.
- **Bottom:** 21px reserved for the home indicator, plus the floating nav bar
  sits at `bottom: 32px` from the screen edge, 369px wide × 67px tall, centered.
- **Content area:** 16px gutters left/right, 78px top inset (under status bar +
  16px breathing room).
- The nav bar floats over scrollable content (translucent `rgba(34,38,47,0.9)`)
  — content can scroll behind it. It does **not** push the layout up.

### Transparency & blur
- Used only for **status overlays**:
  - Modal scrims: `rgba(0,0,0,0.5)`.
  - Status backgrounds: solid color at 20% alpha (e.g. `rgba(255,159,28,0.2)`).
  - Icon backplates: solid color at 30% alpha.
  - Nav bar: 90% alpha + (implied) backdrop blur.
- We do **not** use blur on cards, on the page, or for hero treatments.

---

## Iconography

(Detailed above under Visual Foundations → Iconography.)

**TL;DR:** every icon is **Lucide bold-stroke @ 24px**, sitting in a 32–48px
circular backplate tinted to match the meaning. We bundle Lucide via CDN so
the kit can use any of its ~1,500 icons without growing this folder.

Mapping from Vuesax (source) → Lucide (substitute):

| Source (vuesax/bold) | Lucide      | Where it appears |
|----------------------|-------------|------------------|
| `home`               | `house`     | Nav bar — Home tab |
| `routing`            | `route`     | Nav bar — Maintenance, Log Maintenance icon |
| `calendar-2`         | `calendar`  | Nav bar — Reminders, date input |
| `setting-2`          | `settings`  | Nav bar — Settings |
| `arrow-3`            | `arrow-down-up` | "Switch car" caret + sort buttons |
| `arrow-left`         | `arrow-left` | Back button on detail screens |
| `trash`              | `trash-2`   | Delete confirmation modal |
| `edit-2`             | `pencil`    | Edit reminder, edit log |
| `wrench` (implied)   | `wrench`    | Oil-change & service icons |
| `gauge` (implied)    | `gauge`     | Mileage card |
| `plus`               | `plus`      | Add New Car, increment mileage |
| `chevron-down`       | `chevron-down` | Selectable inputs |
| `bell`               | `bell`      | Reminders / alerts |

The **Esterling** symbol (used in front of currency values) was a custom glyph
in the source. We replaced it with a clean **`£` text glyph**, but the product
displays "LE" *after* the value (Egyptian Pound). If the brand truly intends
sterling, this is a content bug to flag.

---

## Open questions / things to confirm with the user

These are flagged in the relevant sections above but collected here:

1. **Currency:** values say `LE` (Egyptian Pound) but the icon is "Esterling"
   (sterling). Which is correct?
2. **Vuesax license:** we substituted Lucide. If you have a Vuesax license,
   drop the SVGs in `assets/icons/` and we'll switch the kit over.
3. **Marketing surface:** the system targets only the mobile app. If a
   marketing site / app-store assets / onboarding deck is needed, we have
   the foundations but no examples — let us know.
4. **No logo provided.** We've created a wordmark + monogram from the brand
   name in `assets/`; replace if there's an official one.
