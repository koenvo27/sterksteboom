// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Definitief domein van het project. Wordt gebruikt voor canonical-URL's,
// Open Graph-tags en de sitemap. Ook ingesteld als custom domein op GitHub
// Pages (zie public/CNAME).
export default defineConfig({
  site: "https://desterksteboomvanrendestede.be",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
