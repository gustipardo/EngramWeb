import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://engramcards.com",
  integrations: [
    // base styles come from src/styles/global.css (imported in Head.astro)
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // /beta is the testers' download page, not for search.
      filter: (page) => !page.includes("/beta"),
      i18n: {
        defaultLocale: "es",
        locales: {
          es: "es",
          en: "en",
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
