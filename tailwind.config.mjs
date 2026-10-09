/**
 * Mesa, modern pixel (_design/09-mesa-pixel/ART-STYLE.md). Colours are the --mesa-*
 * CSS variables from src/styles/mesa-tokens.css (a mirror of _design/03-tokens), so a
 * class like `text-mesa-ink2` follows whichever table is on <html data-pal>.
 */
const mesa = [
  'paper', 'surface', 'ink', 'ink2', 'ink3', 'rule', 'rule2', 'new', 'learn', 'due',
  'felt', 'felt2', 'on-felt', 'on-felt2', 'back', 'on-back', 'miss-felt',
  'card', 'card-ink', 'card-ink2', 'good', 'again', 'outline',
];

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        mesa: Object.fromEntries(mesa.map((k) => [k, `var(--mesa-${k})`])),
      },
      fontFamily: {
        disp: ['Doto', '"Geist Mono"', 'ui-monospace', 'monospace'],
        ui: ['Geist', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sans: ['Geist', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        wordmark: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
