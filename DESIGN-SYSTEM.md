# AutoMate Design System

> Reference for Lovable and frontend team. All generated components must follow these rules.
> Last updated: March 2026

---

## Color Palette

### Semantic Colors (Dark Mode Only)

```
Background:           #0F172A  (slate-950)
Surface (Cards):      #1E293B  (slate-800)
Surface Light:        #334155  (slate-700, hover states)
Text Primary:         #F1F5F9  (slate-100)
Text Secondary:       #94A3B8  (slate-400)
Text Tertiary:        #64748B  (slate-500, very muted)
Divider/Border:       #475569  (slate-600)
```

### Status Colors
```
Success / OK:         #10B981  (emerald-500)
Warning / Due Soon:   #F59E0B  (amber-500)
Error / Overdue:      #EF4444  (red-500)
Info:                 #3B82F6  (blue-500)
```

### Accent Color
```
Primary Accent:       #FBBF24  (amber-400) ← all CTAs, highlights, active states
Accent Hover:         #F59E0B  (amber-500) ← darker on press/hover
```

### Maintenance Type Colors (Icon + Badge Colors)
```
Oil Change:           #F59E0B  (amber)
Tires:                #6B7280  (gray-500)
Battery:              #3B82F6  (blue-500)
Brakes:               #EF4444  (red-500)
Air Filter:           #10B981  (emerald-500)
Fuel Filter:          #8B5CF6  (violet-500)
Transmission:         #EC4899  (pink-500)
Coolant:              #06B6D4  (cyan-500)
Spark Plugs:          #F97316  (orange-500)
Wipers:               #6366F1  (indigo-500)
Custom Types:         #8B5CF6  (purple) ← default for user-created types
```

### Future Light Mode (Not Used in MVP, Reference Only)
```
Light Background:     #F8FAFC  (slate-50)
Light Surface:        #F1F5F9  (slate-100)
Light Text Primary:   #0F172A  (slate-950)
Light Text Secondary: #475569  (slate-600)
Light Divider:        #E2E8F0  (slate-200)
```

---

## Typography

### Font Stack
```
Font Family: Inter (Google Fonts or system fallback)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif
```

### Type Scale

| Use Case          | Size | Weight | Line Height | Example                        |
| ----------------- | ---- | ------ | ----------- | ------------------------------ |
| H1 (Page Title)   | 24px | 700    | 1.5         | "Home", "Maintenance Overview"  |
| H2 (Section Head) | 20px | 700    | 1.5         | "Next Service Due"             |
| H3 (Subsection)   | 18px | 600    | 1.5         | Card titles                    |
| Body (Main Text)  | 16px | 400    | 1.5         | Descriptions, list items       |
| Body Small        | 14px | 400    | 1.5         | Secondary text, hints          |
| Label             | 12px | 500    | 1.5         | Form labels, badge text        |
| Label Small       | 10px | 500    | 1.5         | Micro labels, timestamps       |

**Guideline:** Minimum font size is 10px (labels). Never smaller.

---

## Spacing System

### Base Unit
```
1 unit = 4px
xs = 4px    (1 unit)
sm = 8px    (2 units)
md = 16px   (4 units)     ← primary horizontal padding, form gaps
lg = 24px   (6 units)     ← section gaps, vertical spacing
xl = 32px   (8 units)
xxl = 48px  (12 units)
```

### Common Applied Spacing

```
Screen horizontal padding:      16px (md)
Gap between form fields:        16px (md)
Gap between sections:           24px (lg)
Card padding:                   16px (md)
Modal/BottomSheet padding:      24px (lg)
Bottom nav height:              64px (includes safe area)
Top safe area (notch):          44px (platform-dependent)
Input/Button height:            48px (12 units)
Hero card padding:              20px
Chip padding horizontal:        12px
Chip padding vertical:          8px
Icon size (24px icons):         24px
Icon size (small, in labels):   16px
Icon size (large, hero):        32px
```

---

## Component Specs

### Button

```
Height:               48px
Padding horizontal:   16px
Padding vertical:     12px
Border radius:        8px
Font size:            16px, weight 600
Transition:           100ms ease-out (opacity, background)
```

#### Button States

**Primary (CTA / Call-to-Action)**
```
Background:           #FBBF24 (amber-400)
Text color:           #0F172A (dark)
Border:               none
Hover/Press:          background #F59E0B (amber-500)
Disabled:             opacity 50%
```

**Secondary**
```
Background:           #334155 (slate-700)
Text color:           #F1F5F9 (text-primary)
Border:               1px #475569 (divider)
Hover/Press:          background #475569
Disabled:             opacity 50%
```

**Ghost / Link**
```
Background:           transparent
Text color:           #FBBF24 (amber-400)
Border:               none
Hover/Press:          text #F59E0B (amber-500)
Disabled:             opacity 50%
```

**Destructive (Delete, Sign Out)**
```
Background:           #EF4444 (red-500)
Text color:           #FFFFFF
Border:               none
Hover/Press:          background #DC2626 (red-600)
```

### Input Fields

```
Height:               48px
Padding:              12px horizontal, 12px vertical
Border:               1px #475569 (divider color, solid)
Border radius:        8px
Background:           #1E293B (surface)
Font size:            16px, weight 400
Placeholder color:    #64748B (text-tertiary)
```

#### Input States

**Default**
```
Border color:         #475569 (divider)
Background:           #1E293B (surface)
Text color:           #F1F5F9 (text-primary)
```

**Focus**
```
Border color:         #FBBF24 (amber-400)
Background:           #1E293B (unchanged)
Box shadow:           none (flat design)
Outline:              2px inset #FBBF24 (optional, for accessibility)
```

**Error**
```
Border color:         #EF4444 (red-500)
Background:           #1E293B (unchanged)
Error message:        12px, #EF4444, margin-top 4px
```

**Disabled**
```
Border color:         #475569 (divider)
Background:           #0F172A (darker background)
Text color:           #64748B (text-tertiary)
Opacity:              50%
```

### Card / List Item

```
Padding:              16px
Border radius:        12px
Background:           #1E293B (surface)
Border:               1px #475569 (divider)
Shadow:               none (flat design, no shadows)
Separator line:       1px #475569 between list items
```

### Badge

```
Height:               24px
Padding horizontal:   8px
Padding vertical:     4px
Border radius:        4px (square-ish)
Font size:            12px, weight 500
Background:           color @ 20% opacity (e.g., #10B98120 for green)
Text color:           color @ 100% (e.g., #10B981 for green)
```

**Status Badge Examples:**
```
Success: bg #10B98120, text #10B981
Warning: bg #F59E0B20, text #F59E0B
Error:   bg #EF444420, text #EF4444
Info:    bg #3B82F620, text #3B82F6
```

### Modal / Bottom Sheet

```
Border radius (top):  16px
Padding:              24px (top, bottom, left, right)
Background:           #1E293B (surface)
Header font:          H2 (20px, bold)
Header margin-bottom: 16px
Overlay:              black @ 60% opacity
Animation in:         slide-up 200ms ease-out
Animation out:        slide-down 200ms ease-out
Safe area bottom:     +20px padding (for home indicator)
```

#### Modal Layout
```
[X] Header Title
────────────────────────
Content area (scrollable if needed)
────────────────────────
[Cancel] [Confirm]      ← buttons at bottom, sticky
```

### Toggle Switch

```
Width:                48px
Height:               28px
Border radius:        14px (pill-shaped)
Background off:       #475569 (divider)
Background on:        #FBBF24 (amber-400)
Dot size:             24px (white circle)
Dot position:         2px padding from edge
Transition:           100ms ease-out
```

### Skeleton / Loading

```
Background:           #334155 (surface-light)
Border radius:        8px
Animation:            shimmer 2s infinite ease-in-out
Shimmer gradient:     white 20% opacity, sweeping LTR
Height:               match the content it's replacing
```

**Skeleton Layout:**
- Title skeleton: H3 height (18px) @ full width
- Subtitle skeleton: Body height (16px) @ 70% width
- Content blocks: stacked with 12px gap

### Form Layout

```
Field container:      24px margin-bottom (lg)
Label:                12px, weight 500, #94A3B8 (text-secondary)
Label to field gap:   8px
Input height:         48px (standard)
Error message:        12px, #EF4444, margin-top 4px, margin-bottom 8px
Helper text:          12px, #64748B (text-tertiary), margin-top 4px
```

#### Form Example
```
[Label]           ← 12px, text-secondary
[Gap 8px]
[Input 48px]      ← with border + focus state
[Gap 4px]
[Error msg]       ← if validation fails (optional)
[Gap 16px]
[Next field...]
```

---

## RTL (Arabic) Support

### NativeWind RTL Utilities

**Root Container:**
```typescript
<View className={language === 'ar' ? 'direction-rtl' : ''}>
  {children}
</View>
```

**When direction-rtl is applied:**
- All directional utilities auto-reverse:
  - `ml-4` → `mr-4` (margin-left ↔ margin-right)
  - `pl-4` → `pr-4` (padding-left ↔ padding-right)
  - `text-left` → `text-right` (text alignment)
  - `absolute left-4` → `absolute right-4`

**Flexbox in RTL:**
- `flex-row` renders right-to-left automatically
- Use `flex-row-reverse` to force left-to-right in RTL (rarely needed)

### Components That Need Manual Flipping

**Icons (directional):**
```
← Back arrow:           flip horizontally in RTL (or use right-arrow asset)
→ Forward arrow:        flip horizontally in RTL (or use left-arrow asset)
→ Chevron right:        becomes ← in RTL (auto-flip or use chevron-left asset)
→ Menu (hamburger):     NO flip needed (symmetric)
↙ Corner curves:        position reversal (LTR corners flip to RTL)
```

**Example: Back Button**
```typescript
<View className={`flex-row items-center ${isRTL ? 'scale-x-[-1]' : ''}`}>
  <ChevronLeftIcon size={24} />
  <Text>Back</Text>
</View>
```

### Typography in RTL

- Text: auto-justified to right in RTL via `direction: rtl`
- Numbers: keep LTR (e.g., "15 March 2026" or "₹150" render LTR even in RTL)
- Dates: consider locale (e.g., "15 مارس 2026" vs "2026-03-15")

### Lists and Scrolling

- **Horizontal scrolls:** auto-reverse in RTL (first item → rightmost in RTL)
- **Vertical lists:** no change (always top to bottom)
- **Grid:** auto-reverses column order in RTL

---

## Animations

### Timing
```
Fade in/out:      150ms ease-out
Slide (modal):    200ms ease-out
Transition (UI):  100ms ease-out
Skeleton shimmer: 2000ms (2s) infinite ease-in-out
Press/tap:        50ms (haptic feedback)
```

### No Heavy Animations
- Avoid rotations, 3D transforms (hurts RN performance)
- Avoid opacity chains with many elements
- Prefer: fade, slide, scale (simple 2D transforms)

---

## Accessibility (WCAG AA)

### Color Contrast
```
#F1F5F9 (text-primary) on #0F172A (bg):  18.5:1 ✓ (exceeds AA)
#94A3B8 (text-secondary) on #0F172A:      5.2:1 ✓ (meets AA)
#64748B (text-tertiary) on #0F172A:       3.8:1 ⚠ (fails AA, use sparingly)
#FBBF24 (amber) on #0F172A:               8.2:1 ✓ (exceeds AA)
```

### Minimum Touch Target
```
All interactive elements:  48px × 48px (or equivalent area)
Button minimum height:     48px ✓
Input minimum height:      48px ✓
Toggle minimum size:       28px × 48px ✓
Tap area padding:          at least 8px around clickable element
```

### Status Indicators
- **Never use color alone.** Always pair status colors with icons + text labels:
  - Status badge + icon + text = redundant, accessible
  - Color-only circle = inaccessible

### Forms
- All inputs have associated labels (`<label htmlFor>` in web, accessibility props in RN)
- Error messages linked via `aria-describedby` (web) or `accessibilityHint` (RN)
- Required fields marked with `*` and `aria-required="true"`

---

## Dark Mode Only (MVP)

All MVP screens are **dark mode only**. Light/dark toggle exists in Settings but both variants will behave identically (always dark).

**Future light mode** (post-MVP) will use the "Light Mode" colors listed in the Color Palette section.

---

## Component Checklist for Lovable

When Lovable generates a component, verify:

- [ ] Colors match design palette exactly (no arbitrary colors)
- [ ] NativeWind utilities only (no inline styles, no StyleSheet)
- [ ] Button heights are 48px (or 28px for toggles)
- [ ] Input heights are 48px
- [ ] Padding uses grid: 8, 16, 24, 32px (multiples of 4)
- [ ] Border radius: 8px (inputs), 12px (cards), 16px (modals), 4px (badges)
- [ ] Typography matches scale (H1=24px, H2=20px, Body=16px, etc.)
- [ ] Focus states show amber border (#FBBF24)
- [ ] RTL: wrapped with `direction-rtl` when applicable
- [ ] Animations: 100–200ms ease-out (no long animations)
- [ ] Touch targets: minimum 48px × 48px
- [ ] Empty states: unique illustration + copy per screen
- [ ] Loading states: skeleton shimmer, no spinners
- [ ] Error states: red (#EF4444) text + retry button

---

## Usage Examples

### Example 1: Building a Button

```typescript
// ✓ Correct: NativeWind + design tokens
import { Pressable, Text } from 'react-native';

export function Button({ onPress, label, variant = 'primary' }) {
  const bgColor = variant === 'primary' ? 'bg-amber-400' : 'bg-slate-700';
  const textColor = variant === 'primary' ? 'text-slate-950' : 'text-slate-100';
  
  return (
    <Pressable
      onPress={onPress}
      className={`h-12 px-4 rounded-lg items-center justify-center ${bgColor} active:opacity-80`}
    >
      <Text className={`text-base font-semibold ${textColor}`}>{label}</Text>
    </Pressable>
  );
}
```

### Example 2: Building an Input

```typescript
// ✓ Correct: Design tokens applied
import { TextInput, View, Text } from 'react-native';

export function Input({ label, error, ...props }) {
  return (
    <View className="mb-6">
      {label && (
        <Text className="text-xs font-medium text-slate-400 mb-2">{label}</Text>
      )}
      <TextInput
        className={`h-12 px-3 rounded-lg bg-slate-800 border-2 text-slate-100 placeholder:text-slate-500 ${
          error ? 'border-red-500' : 'border-slate-600 focus:border-amber-400'
        }`}
        {...props}
      />
      {error && (
        <Text className="text-xs text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
```

### Example 3: Dark Mode Card

```typescript
// ✓ Correct: Dark colors, flat design
import { View, Text } from 'react-native';

export function MaintenanceCard({ type, dueDate, status }) {
  const statusColor = status === 'overdue' ? '#EF4444' : status === 'due-soon' ? '#F59E0B' : '#10B981';
  
  return (
    <View className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-3">
      <View className="flex-row items-center mb-3">
        <View className={`w-8 h-8 rounded-full mr-3`} style={{ backgroundColor: statusColor }} />
        <Text className="text-lg font-semibold text-slate-100">{type}</Text>
      </View>
      <Text className="text-sm text-slate-400">Due: {dueDate}</Text>
      <View
        className="mt-3 px-2 py-1 rounded-sm bg-opacity-20"
        style={{ backgroundColor: statusColor }}
      >
        <Text className="text-xs font-medium" style={{ color: statusColor }}>
          {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
```

---

## Questions?

If Lovable generates something that doesn't match this spec:
1. **Share the screenshot** in the team Slack
2. **Quote the design rule** (e.g., "Button height should be 48px per DESIGN-SYSTEM.md")
3. **Prompt Lovable:** "Update [component] to match DESIGN-SYSTEM.md exactly. Use only NativeWind utilities."

---

**End of Design System v1.0**
