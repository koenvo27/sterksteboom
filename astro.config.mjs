// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Definitief domein van het project. Wordt gebruikt voor canonical-URL's,
// Open Graph-tags en de sitemap. Ook ingesteld als custom domein op GitHub
// Pages (zie public/CNAME).
export default defineConfig({
  site: "https://desterksteboomvanrendestede.be",
  integrations: [
    sitemap({
      // Het dagboek is voorlopig verborgen: geen links op de site en niet
      // in de sitemap. Verwijder dit filter om het weer op te nemen.
      filter: (page) => !page.includes("/dagboek") && !page.includes("/bedankt"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
