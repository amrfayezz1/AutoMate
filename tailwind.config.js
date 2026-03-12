/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                // Semantic background
                'bg-primary': '#0F172A',
                'bg-surface': '#1E293B',
                'bg-surface-light': '#334155',
                // Text
                'text-primary': '#F1F5F9',
                'text-secondary': '#94A3B8',
                'text-tertiary': '#64748B',
                // Borders
                'border-default': '#475569',
                // Accent
                'accent': '#FBBF24',
                'accent-hover': '#F59E0B',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui'],
            },
        },
    },
    plugins: [],
};
