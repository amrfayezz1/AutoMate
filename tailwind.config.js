/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Surface elevation scale (dark-first)
        surface: {
          0:   '#0F1115',
          1:   '#16191F',
          2:   '#1A1D24',
          3:   '#22262F',
          4:   '#2A2F3A',
        },
        // Brand
        brand: {
          DEFAULT: '#3A86FF',
          20:      'rgba(58,134,255,0.20)',
          30:      'rgba(58,134,255,0.30)',
        },
        // Status
        warn: {
          DEFAULT: '#FF9F1C',
          20:      'rgba(255,159,28,0.20)',
          30:      'rgba(255,159,28,0.30)',
        },
        danger: {
          DEFAULT: '#E63946',
          20:      'rgba(230,57,70,0.20)',
          30:      'rgba(230,57,70,0.30)',
        },
        success: {
          DEFAULT: '#2EC4B6',
          20:      'rgba(46,196,182,0.20)',
          30:      'rgba(46,196,182,0.30)',
        },
        info: '#00D4FF',
        // Foreground (text + icons)
        fg: {
          1:       '#E6E8EC',
          2:       '#A1A7B3',
          3:       '#B0B6C3',
          muted:   '#6B7280',
          'on-brand': '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Montserrat_400Regular', 'System'],
        medium: ['Montserrat_500Medium', 'System'],
      },
      fontSize: {
        // Design system type scale
        xs:   ['12px', { lineHeight: '16px' }],
        sm:   ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg:   ['18px', { lineHeight: '24px' }],
        xl:   ['20px', { lineHeight: '28px' }],
        '2xl':['24px', { lineHeight: '32px' }],
      },
      borderRadius: {
        card:  '16px',
        sheet: '24px',
        pill:  '9999px',
      },
      spacing: {
        // 8px base grid + 4px half-steps
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
      },
    },
  },
  plugins: [],
};
