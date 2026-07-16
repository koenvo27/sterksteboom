# Publiceren (Deployment)

Deze website is een statische site (HTML/CSS/JS) en kan gratis gehost worden.
Deze repository is al ingesteld voor **GitHub Pages** (Optie A). Daarnaast
werken **Cloudflare Pages** en **Netlify** even goed — die geven je meteen een
gratis preview-adres zonder dat je het domein al hoeft te koppelen (Optie B/C).

Build-instellingen (gelden voor alle platformen):

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node-versie**: 22 of hoger

---

## Optie A: GitHub Pages (huidige opzet)

De workflow `.github/workflows/deploy.yml` bouwt de site en publiceert ze naar
GitHub Pages bij elke push naar de deploy-branch.

1. Ga naar **Settings → Pages** van de repository.
2. Onder **Build and deployment → Source**, kies **GitHub Actions**.
3. Push naar de branch (of start de workflow via **Actions → Re-run jobs**).
4. Koppel het domein: het bestand `public/CNAME` bevat al
   `desterksteboomvanrendestede.be`. Stel de DNS-records in bij je registrar:

   | Type | Naam | Waarde |
   |------|------|--------|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `koenvo27.github.io` |

5. Zet daarna in **Settings → Pages** de optie **Enforce HTTPS** aan.

> Let op: omdat de site interne links vanaf de root gebruikt, werkt GitHub Pages
> pas volledig op het eigen domein (root), niet op een submap-URL. Wil je een
> preview zónder domein, gebruik dan Optie B of C hieronder.

---

## Optie B: Cloudflare Pages

1. Maak een gratis Cloudflare-account op https://dash.cloudflare.com.
2. Ga naar **Workers & Pages → Create → Pages → Connect to Git** en kies de
   repository `koenvo27/sterksteboom`.
3. Vul de build-instellingen in zoals hierboven (`npm run build`, output
   `dist`).
4. Klik op **Save and Deploy**. Na een paar minuten krijg je een gratis
   `*.pages.dev`-adres waarop de site al zichtbaar is — zonder domein.
5. Koppel het eigen domein: ga naar het Pages-project → **Custom domains** →
   **Set up a custom domain** → vul `desterksteboomvanrendestede.be` in en volg
   de instructies.

## Optie C: Netlify

1. Maak een gratis account op https://app.netlify.com.
2. Klik op **Add new site → Import an existing project** en kies de repository.
3. Vul de build-instellingen in: build command `npm run build`, publish
   directory `dist`.
4. Klik op **Deploy site**. Je krijgt een gratis `*.netlify.app`-adres.
5. Koppel het eigen domein via **Site configuration → Domain management → Add a
   domain** en volg de DNS-instructies.

## Formulierendpoint koppelen (optioneel)

Zolang er geen formulierendpoint is ingesteld, tonen de contact- en
sponsorpagina's automatisch een duidelijke mailknop in plaats van een
(niet-werkend) formulier.

Om het formulier te activeren via **Formspree**:

1. Maak een gratis account op https://formspree.io.
2. Maak een nieuw formulier aan en kopieer de endpoint-URL
   (bv. `https://formspree.io/f/xxxxxxx`).
3. Vul deze URL in bij `src/data/site-config.ts`, of als omgevingsvariabele
   `PUBLIC_FORM_ENDPOINT` in de instellingen van je hostingplatform, of lokaal
   in een `.env`-bestand op basis van `.env.example`.
4. Bouw de site opnieuw (bij gekoppelde hosting gebeurt dit automatisch bij elke
   nieuwe commit).

## Nieuwe versie publiceren

Omdat de site gekoppeld is aan de GitHub-repository, volstaat het om
wijzigingen te committen en te pushen:

```bash
git add .
git commit -m "Update inhoud"
git push
```

GitHub Pages (of Cloudflare Pages / Netlify) start dan automatisch een nieuwe
build en publiceert de nieuwe versie.

## Analytics (optioneel, later)

De website gebruikt standaard geen analytics of tracking. Wanneer je later
bijvoorbeeld **Plausible** of **Cloudflare Web Analytics** wil toevoegen
(beide privacyvriendelijk, geen cookiebanner nodig), voeg je enkel het
bijhorende script toe in `src/layouts/Layout.astro`. Werk in dat geval ook
`/cookies` bij, zoals daar al vermeld staat.
