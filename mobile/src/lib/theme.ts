// AutoMate Design System - Official Brand Colors
// Light & Dark Mode Support

// ============================================
// 1️⃣ BRAND CORE (Shared across modes)
// ============================================

export const Brand = {
  // Primary (Actions, CTAs)
  primary: {
    400: '#60A5FA', // Highlights
    500: '#2563EB', // Main brand blue
    600: '#1D4ED8', // Pressed/active
  },
  // Secondary (Accent)
  secondary: {
    500: '#22C55E', // Success, good health
  },
};

// ============================================
// 4️⃣ STATUS & FEEDBACK COLORS
// ============================================

export const Status = {
  success: '#22C55E',   // Green - Good
  warning: '#FACC15',   // Yellow - Due Soon
  critical: '#EF4444',  // Red - Overdue
  info: '#38BDF8',      // Blue - Info
  disabled: '#9CA3AF',  // Gray - Disabled
};

// ============================================
// 5️⃣ MAINTENANCE TYPE COLORS
// ============================================

export const Maintenance = {
  oil: '#FBBF24',
  tires: '#9CA3AF',
  battery: '#60A5FA',
  brakes: '#F87171',
  filters: '#34D399',
  fluids: '#A78BFA',
  inspection: '#FB923C',
  custom: '#A78BFA',
};

// ============================================
// 6️⃣ CAR STATUS RATING
// ============================================

export const Rating = {
  excellent: '#22C55E',  // A / 5★
  good: '#22C55E',       // A / 5★
  fair: '#FACC15',       // B-C / 3-4★
  poor: '#FACC15',       // B-C / 3-4★
  critical: '#EF4444',   // D-F / 1-2★
};

// ============================================
// 2️⃣ LIGHT MODE PALETTE
// ============================================

export const LightTheme = {
  // Backgrounds
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',

  // Text
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E5E7EB',
  divider: '#D1D5DB',

  // Icons
  iconPrimary: '#374151',
  iconMuted: '#9CA3AF',

  // Brand
  primary: Brand.primary[500],
  primaryLight: Brand.primary[400],
  primaryDark: Brand.primary[600],
  secondary: Brand.secondary[500],

  // Status
  ...Status,

  // Maintenance
  maintenance: Maintenance,

  // Rating
  rating: Rating,
};

// ============================================
// 3️⃣ DARK MODE PALETTE
// ============================================

export const DarkTheme = {
  // Backgrounds
  background: '#0F172A',
  surface: '#111827',
  surfaceAlt: '#1F2933',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textInverse: '#020617',

  // Borders
  border: '#1F2937',
  divider: '#374151',

  // Icons
  iconPrimary: '#E5E7EB',
  iconMuted: '#9CA3AF',

  // Brand
  primary: Brand.primary[500],
  primaryLight: Brand.primary[400],
  primaryDark: Brand.primary[600],
  secondary: Brand.secondary[500],

  // Status
  ...Status,

  // Maintenance
  maintenance: Maintenance,

  // Rating
  rating: Rating,
};

// ============================================
// SPACING & TYPOGRAPHY
// ============================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// THEME TYPE & HOOK
// ============================================

export type Theme = typeof LightTheme;

// Helper to get theme based on mode
export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'dark' ? DarkTheme : LightTheme;
};

// Default export for backwards compatibility
export const Colors = {
  brand: Brand,
  status: Status,
  maintenance: Maintenance,
  rating: Rating,
  light: LightTheme,
  dark: DarkTheme,
};

export default Colors;
