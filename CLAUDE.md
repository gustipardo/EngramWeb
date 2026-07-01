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
├── tailwind.config.mjs  ← Engram palette: navy / amber / paper / sage / terracota (mirrors _design/03-tokens)
├── tsconfig.json        ← Extends Astro strict defaults
├── package.json
├── public/              ← Static assets (favicon.svg referenced; add real assets here)
└── src/
    ├── layouts/
    │   ├── Layout.astro      ← Master HTML template: meta, JSON-LD (FAQPage + SoftwareApplication), canonical + hreflang, Open Graph
    │   └── LegalLayout.astro ← Dedicated legal chrome (own head/canonical/hreflang, no marketing JSON-LD)
    ├── pages/
    │   ├── index.astro           ← /            (Spanish)
    │   ├── privacy.astro         ← /privacy     (ES) — legal copy inline, NOT in i18n (intentional exception)
    │   ├── terms.astro           ← /terms       (ES)
    │   └── en/                   ← /en/, /en/privacy, /en/terms (English mirrors)
    ├── components/           ← One component per landing section
    │   ├── Header.astro       ← Nav + Engram wordmark + lang switcher + download CTA + mobile hamburger
    │   ├── Hero.astro         ← Tagline, headline, subtitle, dual CTAs
    │   ├── TrustStrip.astro   ← Credibility strip under the hero
    │   ├── Features.astro     ← 6-card grid with SVG icons
    │   ├── HowItWorks.astro   ← Numbered step list
    │   ├── Manifesto.astro    ← Anti-Duolingo positioning section
    │   ├── Pricing.astro      ← Plan cards (trial + monthly/yearly)
    │   ├── FAQ.astro          ← Collapsible accordion with chevron rotation
    │   ├── CTA.astro          ← Full-width download CTA (APK button still href="#", pending a real URL)
    │   └── Footer.astro       ← Footer: brand / product / legal / support (mailto) / copyright
    └── i18n/
        ├── es.json
        ├── en.json
        └── index.ts
```

## Conventions

- **Light mode is the brand default** (decision 2026-06-27; overrides the older dark-default note in `_design/01-identidad.md`). The landing renders light with the Engram palette (paper background, amber accents).
- **Copy lives in `src/i18n/*.json` only.** Don't put strings in `.astro` files; add keys to both `es.json` and `en.json`. Exception: long-form legal text lives inline in `privacy/terms` pages by design.
- **SEO:** when adding a page, update `Layout.astro`'s canonical/hreflang generation and check sitemap output.
- **Accessibility baseline:** ARIA labels present, semantic HTML, mobile breakpoints via Tailwind (`sm`, `md`, `lg`). Preserve these when editing.

## When to touch `_design/` instead

- Changing brand colors / type / spacing → edit `_design/03-tokens/tokens.json` + regenerate `tokens.css`, then consume here.
- Changing voice / messaging style → consult `_design/01-identidad.md` §10 before writing copy.
- Rendering marketing banners (OG image, social) → use templates in `_design/05-marketing/banners/` + Puppeteer (see `rendering-guide.md`). Don't build those in Astro.
