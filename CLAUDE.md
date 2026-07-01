# CLAUDE.md — Web/ (landing page)

Guidance for working inside the Astro landing page.

> For the whole-project map, see `../CLAUDE.md` at the repo root.
> For brand voice / visual system, see `../_design/01-identidad.md` + `../_design/03-tokens/`.

## What this is

Production-ready bilingual ES/EN landing page for Flashcards Conversacionales (wordmark: Engram). Astro 5 + Tailwind 3.4. Static output.

**This is the real landing page.** The old empty `Landing page/` sibling folder has been deleted.

## Commands

```bash
npm install
npm run dev      # dev server on localhost:4321
npm run build    # static build to dist/
npm run preview  # preview the built site
```

## Stack

- **Astro 5.7** (static site generator, component islands).
- **Tailwind 3.4** via `@astrojs/tailwind`.
- **@astrojs/sitemap** for `/sitemap-index.xml`.
- Note: `_design/` docs target Tailwind v4 + shadcn/ui + next-themes — this codebase hasn't been migrated yet. Don't mix.

## Routing & i18n

Astro's built-in i18n, configured in `astro.config.mjs`:
- `defaultLocale: 'es'` with `prefixDefaultLocale: false` → Spanish is at `/`, English is at `/en/`.

Page files are one-per-locale, intentionally duplicated:
- `src/pages/index.astro` → `/` (ES) — passes `locale="es"` to `Layout`.
- `src/pages/en/index.astro` → `/en/` (EN) — passes `locale="en"`.

Both render the exact same component stack. If you edit one, **edit the other** (or refactor to a shared partial).

Translations:
- `src/i18n/es.json`, `src/i18n/en.json` — flat key trees (`meta`, `nav`, `hero`, `features`, `howItWorks`, `faq`, `cta`, `footer`).
- `src/i18n/index.ts` — helpers: `t(locale)` returns the translation object, `getAlternateUrl()` builds the language-switched URL (ES has no prefix, EN has `/en/`).

## File layout

```
Web/
├── astro.config.mjs     ← Astro + Tailwind + sitemap + i18n config
├── tailwind.config.mjs  ← Custom blue primary palette + purple accents
├── tsconfig.json        ← Extends Astro strict defaults
├── package.json
├── public/              ← Static assets (favicon.svg referenced; add real assets here)
└── src/
    ├── layouts/
    │   └── Layout.astro      ← Master HTML template: meta, JSON-LD (FAQPage + SoftwareApplication), canonical + hreflang, Open Graph
    ├── pages/
    │   ├── index.astro       ← /       (Spanish)
    │   └── en/index.astro    ← /en/    (English)
    ├── components/           ← One component per landing section
    │   ├── Header.astro       ← Nav + logo + lang switcher + download CTA + mobile hamburger
    │   ├── Hero.astro         ← Tagline, headline, subtitle, dual CTAs over blue gradient
    │   ├── Features.astro     ← 6-card grid (voice study, instant evaluation, deck support, hands-free, active recall, conversation) with SVG icons
    │   ├── HowItWorks.astro   ← Numbered step list on gray background
    │   ├── FAQ.astro          ← Collapsible accordion with chevron rotation
    │   ├── CTA.astro          ← Full-width download CTA with blue gradient
    │   └── Footer.astro       ← 4-column footer: brand / product / legal / copyright
    └── i18n/
        ├── es.json
        ├── en.json
        └── index.ts
```

## Conventions

- **Dark mode is the brand default** (see `_design/01-identidad.md`), but the landing currently renders in light mode with blue primaries. If you change this, audit all components.
- **Copy lives in `src/i18n/*.json` only.** Don't put strings in `.astro` files; add keys to both `es.json` and `en.json`.
- **SEO:** when adding a page, update `Layout.astro`'s canonical/hreflang generation and check sitemap output.
- **Accessibility baseline:** ARIA labels present, semantic HTML, mobile breakpoints via Tailwind (`sm`, `md`, `lg`). Preserve these when editing.

## When to touch `_design/` instead

- Changing brand colors / type / spacing → edit `_design/03-tokens/tokens.json` + regenerate `tokens.css`, then consume here.
- Changing voice / messaging style → consult `_design/01-identidad.md` §10 before writing copy.
- Rendering marketing banners (OG image, social) → use templates in `_design/05-marketing/banners/` + Puppeteer (see `rendering-guide.md`). Don't build those in Astro.
