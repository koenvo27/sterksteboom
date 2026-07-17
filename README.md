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
npm test            # unit- en inhoudelijke bewakingstesten
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
| Afbeeldingen | `public/images/` en `src/assets/` |
| Volledig verhaal (tekst) | `src/pages/het-verhaal.astro` |
| De reis / tijdlijn | `src/data/journey.ts` |

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

## Testen

`npm test` draait de testen met de ingebouwde testrunner van Node
(`node --test scripts/*.test.mjs`):

- **`scripts/sync-fundraising.test.mjs`** — de logica die het opgehaalde bedrag
  van de KOTK-pagina leest (bedrag parsen, fallback, timeout).
- **`scripts/content-integrity.test.mjs`** — inhoudelijke afspraken die makkelijk
  per ongeluk sneuvelen: het projecte-mailadres, de veilige 1000 km-formulering,
  de fondsenwervingsdoelen (€5.500 startdoel / €10.000 ambitie), de compacte
  navigatie, precies 4 momenten op de homepage-tijdlijn, de datumgebaseerde
  tijdlijnstatus, geen placeholder-links (`href="#"`), en het weren van het
  oude e-mailadres.

De deploy-workflow draait deze testen **vóór** de build; faalt een test, dan
wordt er niet gepubliceerd.

## Publiceren

Zie **DEPLOYMENT.md** voor een concreet stappenplan. Deze repository bevat ook
een GitHub Actions-workflow (`.github/workflows/deploy.yml`) die de site
automatisch naar GitHub Pages publiceert op het domein
`desterksteboomvanrendestede.be`. De workflow draait eerst `npm test`, dan de
build. Publiceren gebeurt vanaf de `main`-branch.

## Foto's vervangen door echte beelden

De illustratieve foto's in `src/assets/` (`hero-home.jpg`, `verhaal.jpg`,
`op-weg.jpg`) mogen vervangen worden door echte foto's zodra die er zijn.
Behoud de bestandsnamen, dan hoeft er niets aan de code te veranderen; Astro
optimaliseert ze automatisch (WebP, meerdere formaten). Let bij het vervangen op:

- **Alt-teksten**: pas de `alt`-beschrijving aan de echte foto aan (in
  `src/components/Hero.astro`, `StoryIntro.astro` en `src/pages/het-verhaal.astro`).
- **Verhoudingen**: de containers gebruiken vaste beeldverhoudingen (bv. 16/9,
  4/3); kies foto's die daar goed in passen.
- **Social share**: `public/images/social-share.jpg` is exact **1200×630 px**
  (Open Graph). Behoud die afmetingen bij vervanging.
- De poster van de Everesting staat in `public/images/affiche-everesting.jpg`.

## Spambeveiliging op het contactformulier

Het contactformulier post rechtstreeks naar **FormSubmit** (geen tussenlaag).
De spambeveiliging bestaat uit drie lagen:

- **FormSubmit's eigen captcha (Google reCAPTCHA)** — bewust actief gelaten; we
  zetten `_captcha` **niet** op `false`. Bij het verzenden toont FormSubmit een
  korte captcha op zijn eigen pagina, en daarna volgt de redirect naar `/bedankt`
  (`_next`).
- **Honeypot** (`_honey`) — een verborgen veld dat echte bezoekers leeg laten en
  veel bots invullen.
- Een zeer beperkte **`_blacklist`** met ondubbelzinnige spamtermen (bewust smal
  gehouden om geldige berichten niet te blokkeren).

De formulierbezorging (en dus het ontvangende e-mailadres) wordt bepaald door
`formEndpoint` in `src/data/site-config.ts` (standaard de FormSubmit-URL van het
projectadres, overschrijfbaar via `PUBLIC_FORM_ENDPOINT`). Het ontvangende adres
moet één keer bij FormSubmit bevestigd worden; daarna komt elke inzending toe.

## Belangrijk: donaties

Deze website verwerkt zelf **geen** betalingen en vraagt zelf **geen**
betaalgegevens. Elke "Steun het project"-knop verwijst naar de officiële
actiepagina van Kom op tegen Kanker.

## Wat nog ontbreekt (bewust)

Om geen verzonnen informatie te tonen, blijven praktische details bewust vaag
tot ze bevestigd zijn — vooral in `src/content/challenges/everesting-congoberg.md`
("de precieze praktische afspraken volgen zodra alles definitief is"). Vul deze
aan zodra de informatie officieel is.

De events-collectie (`src/content/events/`) is nog leeg op één sjabloonbestand
na (`_voorbeeld.md`, staat op `published: false` en verschijnt nergens). Dat
bestand houdt de build waarschuwingsvrij zolang er nog geen echte publieke actie
is. Kopieer het, geef het een eigen naam, vul echte gegevens in en zet
`published: true` om een actie te tonen.

## Verborgen pagina's

Het **dagboek** (`/dagboek`) is voorlopig verborgen: het staat op `noindex`,
wordt niet in de sitemap opgenomen en er zijn geen links naar toe in de
navigatie. Verwijder het sitemapfilter in `astro.config.mjs` en het `noindex`
in de dagboekpagina's om het weer zichtbaar te maken. Ook `/bedankt` (na het
formulier) en de eigen **404-pagina** staan op `noindex`.

## Kwaliteit

- WCAG 2.2 AA als richtlijn: focusstaten, skip-link, semantische HTML,
  toegankelijke mobiele navigatie, `prefers-reduced-motion` gerespecteerd.
- Geen tracking, geen advertentiecookies, geen cookiebanner nodig zolang dat
  zo blijft (zie `/cookies`).
- SEO: unieke titels/descriptions, Open Graph (met `og:image` 1200×630 +
  afmetingen en alt), Twitter cards, JSON-LD (Organization + WebSite als
  `@graph`, BreadcrumbList, Event, Article), sitemap.xml, robots.txt.
- Dit is een **persoonlijk initiatief**, geen geregistreerde vzw/NGO. De
  structured data gebruikt daarom `Organization` (niet `NGO`) met een duidelijke
  omschrijving en de initiatiefnemer als `founder`.
