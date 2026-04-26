/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core earth ladder
        earth: {
          950: '#1a0f08',
          900: '#241509',
          800: '#3d1f10',
          700: '#5a2e15',
          600: '#7a3e1e',
          500: '#a0532a',
          400: '#c66a32',
          300: '#d97a3c',
          200: '#e8a76b',
          100: '#f0c59a',
          50: '#f7e4c9',
        },
        // Burnt-sunset accent
        ember: {
          700: '#7a2e15',
          600: '#9c3a1a',
          500: '#b8491f',
          400: '#d9551f',
          300: '#e8703a',
          200: '#f2955c',
        },
        // Mustard/golden wheat
        wheat: {
          700: '#6b4a16',
          500: '#c79828',
          400: '#e0b040',
          300: '#f2c75a',
          200: '#fad98a',
        },
        // Deep sage/olive
        sage: {
          700: '#3a3a22',
          500: '#6b6a3a',
          300: '#9a9966',
        },
        // Paper
        paper: '#f2e4c9',
        'paper-2': '#e8d5af',
        ink: '#1a0f08',
        // Semantic
        accent: '#b8491f',
        'accent-hover': '#d9551f',
        'accent-press': '#9c3a1a',
        success: '#7a9a4a',
        warning: '#e0b040',
        danger: '#b33a2a',
        info: '#e8a76b',
      },
      fontFamily: {
        display: ['"Pixelify Sans"', '"Silkscreen"', 'ui-monospace', 'monospace'],
        pixel: ['"Silkscreen"', '"Pixelify Sans"', 'monospace'],
        mono: ['VT323', '"Silkscreen"', 'ui-monospace', 'monospace'],
        serif: ['Newsreader', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': '10px',
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'md': '18px',
        'lg': '22px',
        'xl': '28px',
        '2xl': '36px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '88px',
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
        '8': '64px',
        '9': '96px',
        '10': '128px',
      },
      borderRadius: {
        '0': '0',
        '1': '2px',
        '2': '4px',
        'pill': '999px',
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        '1': '2px 2px 0 #1a0f08',
        '2': '4px 4px 0 #1a0f08',
        '3': '6px 6px 0 #1a0f08',
        'ember': '4px 4px 0 #7a2e15',
      },
      animation: {
        'blink': 'matere-blink 1s steps(2, end) infinite',
        'pulse': 'pulse 1.6s steps(2) infinite',
        'fade-in': 'fade-in 120ms ease-out',
        'toast-in': 'toast-in 180ms ease-out',
      },
      keyframes: {
        'matere-blink': {
          '50%': { opacity: '0' },
        },
        'pulse': {
          '50%': { background: '#a9c674' },
        },
        'fade-in': {
          from: { opacity: '0' },
        },
        'toast-in': {
          from: { transform: 'translateY(20px)', opacity: '0' },
        },
      },
      transitionTimingFunction: {
        'step': 'steps(3, end)',
      },
      transitionDuration: {
        'fast': '90ms',
        'base': '160ms',
        'slow': '280ms',
      },
    },
  },
  plugins: [],
}
