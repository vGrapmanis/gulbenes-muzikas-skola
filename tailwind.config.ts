import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#201820',
        paper: '#F8F8F8',
        gray: {
          100: '#F0F0F0',
          300: '#D0D0D0',
          400: '#B0B0B0',
          500: '#A0A0A0',
          700: '#404040',
          900: '#1A1A1A',
        },
        focus: '#2D6CDF',
        success: '#1E7E34',
        danger: '#B3261E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      fontSize: {
        'scale-sm': '0.875rem',
        'scale-base': '1rem',
        'scale-md': '1.125rem',
        'scale-lg': '1.25rem',
        'scale-xl': '1.5rem',
        'scale-2xl': '2rem',
        'scale-3xl': '2.5rem',
        'scale-4xl': '3.25rem',
      },
      lineHeight: {
        body: '1.6',
        heading: '1.15',
      },
    },
  },
  plugins: [],
};

export default config;
