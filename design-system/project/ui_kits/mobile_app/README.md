# AutoMate mobile app — UI kit

Click-thru recreation of the AutoMate iPhone app, built from the Figma source.

## Run
Open `index.html`. Everything is CDN-loaded React + Babel + Lucide.

## Screens
- **Home** — car header, mileage card, next-due alert, 3 quick actions, recent activity, monthly spend
- **Maintenance** — Upcoming / History tab switcher with status cards
- **Log Maintenance** — full form (type, date, mileage, cost, provider, notes, photo)
- **Switch Car** sheet — bottom-sheet modal with car list + Add New Car CTA
- *Reminders / Settings* — placeholders (not in source Figma)

## Files
- `tokens.js` — color/font/radius tokens, mirrors `/colors_and_type.css`
- `Primitives.jsx` — `Icon`, `Backplate`, `Pill`, `Card`
- `PhoneFrame.jsx` — 402×874 device frame with status bar, home indicator, floating nav
- `Screens.jsx` — `HomeScreen`, `MaintenanceScreen`, `LogMaintenanceScreen`, `SwitchCarSheet`
- `index.html` — interactive shell tying it all together

## Caveats
- Icons are **Lucide** at stroke 2.25 (substitute for Vuesax/iconsax bold).
- Currency uses "LE" + Lucide `pound-sterling` icon (Figma showed an "Esterling" glyph). Confirm currency.
- Reminders / Settings screens are placeholders — not in the source.
