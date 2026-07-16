// ============================================================
// CONTENT COLLECTIES
// Schema's voor nieuws, acties (events) en uitdagingen (challenges).
// Pas de velden hier enkel aan als je nieuwe frontmatter-velden gebruikt.
// ============================================================
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Nieuwsberichten — src/content/news/*.md
const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    author: z.string(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

// Acties en evenementen — src/content/events/*.md
const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    type: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    status: z.enum(["Aankomend", "Afgelopen"]),
    externalUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
  }),
});

// Sportieve uitdagingen — src/content/challenges/*.md
const challenges = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/challenges" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    summary: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    status: z.string().optional(),
    // Optioneel: menselijke datumtekst die de exacte datum vervangt in de
    // weergave (bv. "Mei 2027" voor een meerdaags evenement). De 'date' blijft
    // wel voor sortering en tellers.
    dateLabel: z.string().optional(),
    poster: z.string().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { news, events, challenges };
