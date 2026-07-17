# Contactformulier-Worker (Cloudflare)

Deze Worker maakt de Turnstile-verificatie **verplicht en server-side**. Het
contactformulier post naar de Worker (niet meer rechtstreeks naar FormSubmit);
de Worker controleert de Turnstile-token via de **Siteverify API**, valideert de
velden en stuurt de inzending pas daarna door naar FormSubmit.

## Wat de Worker doet

- Accepteert enkel `POST` en `OPTIONS` vanaf `desterksteboomvanrendestede.be`
  (en `www.`-variant) — CORS.
- Verifieert de Turnstile-token via Siteverify; controleert `success`, `hostname`
  en `action`. Lege, verlopen en hergebruikte tokens worden geweigerd.
- Valideert server-side: naam, e-mail, onderwerp/type, bericht en
  privacytoestemming, met maximale veldlengtes.
- Controleert de honeypot (`_honey`).
- Eenvoudige rate limiting (best-effort in-memory; optioneel duurzaam via KV).
- Pas na volledige validatie: doorsturen naar FormSubmit.
- Geeft nette, niet-technische foutmeldingen terug en logt geen berichtinhoud.

## Vereisten

- Een Cloudflare-account met **Turnstile**-widget voor `desterksteboomvanrendestede.be`.
  - **Site key** (publiek) → staat in de website-config (`turnstileSiteKey`).
  - **Secret key** (geheim) → wordt hieronder als Worker-secret ingesteld.
- Node.js geïnstalleerd (voor `npx wrangler`).

## Stap 1 — Deploy de Worker

```bash
cd worker
npx wrangler login        # eenmalig, opent de browser
npx wrangler deploy
```

Na de deploy toont wrangler de URL, bijvoorbeeld
`https://sterksteboom-contact.<jouw-subdomein>.workers.dev`. Noteer die.

## Stap 2 — Zet de geheime sleutel (nooit in de repo!)

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
# plak de Turnstile *secret key* uit het Cloudflare-dashboard wanneer erom gevraagd wordt
```

## Stap 3 — (Optioneel) e-mailrouting / bezorging

Standaard bezorgt de Worker via **FormSubmit** (`FORM_FORWARD_URL` in
`wrangler.toml`). Dat hergebruikt de bestaande, al geactiveerde FormSubmit-flow —
er is geen extra e-mailconfiguratie nodig.

Wil je later liever rechtstreeks mailen (zonder FormSubmit)? Vervang de
`forward()`-functie in `src/index.js` door een e-mail-API (bv. Resend of
MailChannels) en zet die API-sleutel als extra Worker-secret
(`npx wrangler secret put RESEND_API_KEY`). De rest van de Worker blijft gelijk.

## Stap 4 — (Optioneel) duurzame rate limiting via KV

```bash
npx wrangler kv namespace create RATE_LIMIT
```

Plak de getoonde `id` in `wrangler.toml` onder `[[kv_namespaces]]` (zie de
uitgecommenteerde sectie) en deploy opnieuw. Zonder KV gebruikt de Worker een
lichte in-memory limiter.

## Stap 5 — Koppel de Worker aan de website

Zet in `src/data/site-config.ts` het veld `formWorkerUrl` op de Worker-URL uit
stap 1, **of** stel de omgevingsvariabele `PUBLIC_FORM_WORKER_URL` in bij de
build (bv. als GitHub Actions-variable). Zodra dit ingevuld is:

- verschijnt de Turnstile-widget op het formulier;
- post de frontend naar de Worker in plaats van rechtstreeks naar FormSubmit.

Zolang `formWorkerUrl` leeg is, blijft het formulier gewoon via FormSubmit werken
(met FormSubmit's eigen captcha). Zo kan je de Worker eerst testen vóór de omschakeling.

## Stap 6 — End-to-end test

1. Deploy de site met `formWorkerUrl`/`PUBLIC_FORM_WORKER_URL` ingevuld.
2. Vul het formulier in, los de Turnstile op en verstuur → je belandt op
   `/bedankt` en de mail komt binnen.
3. Test een weigering: open de console en verstuur zonder token (of met een
   ongeldige) → de Worker antwoordt met een foutmelding en er wordt niets
   bezorgd.

Pas nadat deze test slaagt, is de omschakeling volledig. FormSubmit's eigen
reCAPTCHA is dan automatisch niet meer in gebruik (de directe FormSubmit-route
wordt niet meer gebruikt zodra `formWorkerUrl` gezet is).

## Lokaal draaien

```bash
cd worker
npx wrangler dev
```

Gebruik voor lokale tests een Turnstile **testsleutel/secret** uit de Cloudflare-docs.
