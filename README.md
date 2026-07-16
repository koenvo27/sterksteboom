# De Sterkste Boom van Rendestede

Website voor het goede-doelenproject **De Sterkste Boom van Rendestede**, ten
voordele van **Kom op tegen Kanker**.

Gebouwd met **Astro**, **TypeScript** en **Tailwind CSS**. Geen CMS, geen
database, geen login. Alle inhoud wordt beheerd via overzichtelijke Markdown-,
JSON- en TypeScript-bestanden in de broncode.

## Snel starten

Vereist: Node.js 22 of hoger.

```bash
npm install
npm run dev        # lokale ontwikkelserver op http://localhost:4321
npm run build       # productiebuild naar ./dist
npm run preview     # bekijk de productiebuild lokaal
```

## Waar pas ik wat aan?

Zie **CONTENT-BEHEREN.md** voor een stap-voor-stap gids (bedrag aanpassen,
sponsor toevoegen, nieuws schrijven, foto's vervangen, ...).

Kort overzicht:

| Wat | Waar |
|---|---|
| Opgehaald bedrag / doelbedrag | `src/data/fundraising.json` |
| Sponsors / partners | `src/data/sponsors.json` |
| Algemene instellingen, e-mail, donatielink | `src/data/site-config.ts` |
| Hoofdnavigatie | `src/data/navigation.ts` |
| Sociale media links | `src/data/social-links.ts` |
| Nieuwsberichten | `src/content/news/*.md` |
| Uitdagingen (bv. Everesting) | `src/content/challenges/*.md` |
| Acties en evenementen | `src/content/events/*.md` |
| Afbeeldingen | `public/images/` |
| Volledig verhaal (tekst) | `src/pages/ons-verhaal.astro` |

## Projectstructuur

```
src/
  components/     Herbruikbare UI-onderdelen (Header, Hero, kaarten, ...)
  content/         Markdown-content: news/, challenges/, events/
  content.config.ts  Schema-validatie voor de content collections
  data/            Configuratiebestanden (site-config, sponsors, navigatie, ...)
  layouts/         Layout.astro: basislay-out van elke pagina
  pages/           Alle routes van de website
  styles/          global.css met kleuren, typografie en design tokens
public/
  images/          Statische afbeeldingen (logo, social-share, foto's)
  robots.txt, site.webmanifest, favicon.svg
```

## Technologie

- Astro 7 (statische sitegeneratie, content collections met schema-validatie)
- TypeScript (strict)
- Tailwind CSS 4 (via `@tailwindcss/vite`, tokens in `src/styles/global.css`)
- `@astrojs/sitemap` voor een automatische `sitemap.xml`
- Geen React/Vue/Svelte: alle interactiviteit (mobiel menu, kopieer-link,
  nieuwsfilter) is met minimale, vanilla JavaScript gebouwd

## Ontwerp

- **Kleuren**: warm goud (`--color-goud-*`), antraciet (`--color-antraciet-*`),
  gebroken wit/beige (`--color-beige-*`) en een gedempt bosgroen
  (`--color-bos-*`) — zie `src/styles/global.css`.
- **Typografie**: Fraunces (titels), Inter (lopende tekst), Caveat (subtiel
  handgeschreven accent, enkel voor korte tekstjes).
- **Signatuurmotief**: jaarringen van een boom, gebruikt in de hero en in de
  fondsenwervings-voortgangscirkel. Verwijst naar groei, tijd en
  doorzettingsvermogen.

## Publiceren

Zie **DEPLOYMENT.md** voor een concreet stappenplan. Deze repository bevat ook
een GitHub Actions-workflow (`.github/workflows/deploy.yml`) die de site
automatisch naar GitHub Pages publiceert op het domein
`desterksteboomvanrendestede.be`.

## Belangrijk: donaties

Deze website verwerkt zelf **geen** betalingen en vraagt zelf **geen**
betaalgegevens. Elke "Steun het project"-knop verwijst naar de officiële
actiepagina van Kom op tegen Kanker.

## Wat nog ontbreekt (bewust)

Om geen verzonnen informatie te tonen, bevat de website op verschillende
plaatsen `TODO`-commentaren in de Markdown-bronbestanden (vooral in
`src/content/challenges/everesting-congoberg.md`). Vul deze aan zodra de
praktische informatie bekend is.

## Kwaliteit

- WCAG 2.2 AA als richtlijn: focusstaten, skip-link, semantische HTML,
  toegankelijke mobiele navigatie, `prefers-reduced-motion` gerespecteerd.
- Geen tracking, geen advertentiecookies, geen cookiebanner nodig zolang dat
  zo blijft (zie `/cookies`).
- SEO: unieke titels/descriptions, Open Graph, Twitter cards, JSON-LD
  (Organization, Event, Article), sitemap.xml, robots.txt.
