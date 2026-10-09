/** Site-wide settings that are not copy. Copy lives in src/i18n/*.json. */

export const SITE_URL = "https://engramcards.com";
export const SUPPORT_EMAIL = "support@engramcards.com";

/**
 * Google Play listing. Empty until the app is published: the download buttons then
 * become "Join the test group" (mailto SUPPORT_EMAIL). Set it and every CTA switches.
 */
export const PLAY_URL = "";

/** Prices shown in the JSON-LD; keep in step with pricing.pro in src/i18n/*.json. */
export const PRO_MONTHLY_USD = "9.99";
export const PRO_YEARLY_USD = "79.99";

/** Themes: one day table + its night pair (App/src/theme/mesaTheme.ts, ART-STYLE §3). */
export const THEMES = {
  gold: { day: "stone", night: "gold" },
  sage: { day: "sage", night: "midnight" },
  sky: { day: "sky", night: "navy" },
} as const;
export type ThemeId = keyof typeof THEMES;
