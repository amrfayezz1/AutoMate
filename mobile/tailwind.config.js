/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue-500
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald-500
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444', // Red-500
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#1F2937', // Gray-800 (Dark mode base)
          foreground: '#9CA3AF', // Gray-400
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber-500 (Oil change)
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#111827', // Gray-900
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#1F2937', // Gray-800
          foreground: '#FFFFFF',
        },
        background: '#030712', // Gray-950 (Darkest)
        foreground: '#F9FAFB', // Gray-50
        border: '#374151', // Gray-700
        input: '#374151', // Gray-700
        ring: '#3B82F6', // Blue-500
      },
    },
  },
  plugins: [],
}
