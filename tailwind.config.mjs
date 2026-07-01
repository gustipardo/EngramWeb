/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#E8EAF0',
          300: '#6E7791',
          400: '#4A5067',
          500: '#3B4668',
          600: '#2A3250',
          700: '#24304A',
          800: '#1A2339',
          850: '#11182A',
          900: '#0B1020',
          950: '#070A16',
        },
        amber: {
          50:  '#FCF3E2',
          100: '#F6DDAE',
          300: '#F1AE4A',
          500: '#E4A13F',
          600: '#C98E30',
          700: '#B87826',
          800: '#A86C22',
          900: '#8F5C1D',
        },
        paper: {
          50:  '#FEFCF7',
          100: '#FAF7F1',
          200: '#F3EFE6',
          300: '#EDE8DB',
          400: '#E3DCC9',
          600: '#B6A98F',
        },
        sage:       { 300: '#8ABDA0', 500: '#6B9B7E', 700: '#4A7B5C' },
        terracota:  { 300: '#D98E6F', 500: '#C67B5C', 700: '#A55A3D' },
      },
      fontFamily: {
        display: ['Fraunces', 'Instrument Serif', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-hero': ['clamp(40px, 6vw, 72px)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg':   ['clamp(32px, 4.5vw, 48px)', { lineHeight: '1.1',  letterSpacing: '-0.018em' }],
        'display-md':   ['clamp(24px, 3vw, 32px)',   { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        prose: '65ch',
        copy:  '40rem',
      },
      animation: {
        'mic-halo': 'mic-halo 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'mic-halo': {
          '0%':   { boxShadow: '0 0 0 0 rgba(228, 161, 63, 0.45)' },
          '70%':  { boxShadow: '0 0 0 18px rgba(228, 161, 63, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(228, 161, 63, 0)' },
        },
      },
    },
  },
  plugins: [],
};
