# De Sterkste Boom van Rendestede

Website voor **De Sterkste Boom van Rendestede** — sportieve uitdagingen voor
Kom op tegen Kanker, ter nagedachtenis van "de sterkste boom van Rendestede".

Gebouwd met [Astro](https://astro.build) en [Tailwind CSS](https://tailwindcss.com).
De site is volledig statisch en wordt automatisch gedeployed naar GitHub Pages.

## Lokaal ontwikkelen

```bash
npm install
npm run dev      # ontwikkelserver op http://localhost:4321
npm run build    # productiebuild in ./dist
npm run preview  # bekijk de productiebuild lokaal
```

## Structuur

| Map | Inhoud |
| --- | --- |
| `src/pages/` | De pagina's (routes) van de site. |
| `src/components/` | Herbruikbare Astro-componenten. |
| `src/layouts/` | De basislayout met header, footer en SEO. |
| `src/content/` | Nieuws, acties en uitdagingen (Markdown). |
| `src/data/` | Site-instellingen, navigatie, sponsors, fondsenwerving. |
| `public/` | Statische bestanden (favicon, CNAME, robots.txt). |

## Inhoud beheren

- **Algemene instellingen** (naam, e-mail, donatielink, formulier-endpoint):
  `src/data/site-config.ts`
- **Menu**: `src/data/navigation.ts`
- **Fondsenwerving** (bedrag, doel): `src/data/fundraising.json`
- **Sponsors**: `src/data/sponsors.json`
- **Nieuwsbericht toevoegen**: nieuw `.md`-bestand in `src/content/news/`
- **Uitdaging toevoegen**: nieuw `.md`-bestand in `src/content/challenges/`
- **Actie/evenement toevoegen**: nieuw `.md`-bestand in `src/content/events/`

## Deployment

Elke push naar de branch `claude/sterksteboom-github-deploy-aw4yyb` triggert de
workflow in `.github/workflows/deploy.yml`, die de site bouwt en publiceert via
GitHub Pages. Het custom domein staat in `public/CNAME`.
