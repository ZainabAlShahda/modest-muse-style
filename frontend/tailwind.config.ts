import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary — forest green extracted from logo (#2D5A1B)
        sand: {
          DEFAULT: '#2D5A1B',
          50:  '#EFF5EC',
          100: '#D4E8CB',
          200: '#A8D097',
          300: '#72AE5A',
          400: '#2D5A1B',
          500: '#1E3E12',
        },
        // Secondary green tones
        sage: {
          DEFAULT: '#4A8A36',
          50:  '#EBF4E7',
          100: '#C8E3BC',
          200: '#90C87A',
          300: '#4A8A36',
          400: '#356624',
          500: '#254818',
        },
        // Warm gold accent (leaf motif in logo)
        blush: {
          DEFAULT: '#C49A3A',
          50:  '#FBF5E6',
          100: '#F3E4B5',
          200: '#E6C86A',
          300: '#C49A3A',
          400: '#9E7828',
          500: '#785919',
        },
        // Text — greenish charcoal
        charcoal: {
          DEFAULT: '#1C261A',
          light:   '#354831',
          muted:   '#617060',
        },
        // Background — warm ivory matching logo background
        cream: {
          DEFAULT: '#FAF8F2',
          dark:    '#EDE8DC',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md': ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      aspectRatio: {
        product: '3 / 4',
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(28,38,26,0.07), 0 1px 2px -1px rgba(28,38,26,0.07)',
        'card-hover': '0 6px 20px 0 rgba(28,38,26,0.12)',
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-in-out',
        'slide-up':      'slideUp 0.3s ease-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'marquee':       'marquee 28s linear infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:      { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        marquee:      { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};

export default config;
