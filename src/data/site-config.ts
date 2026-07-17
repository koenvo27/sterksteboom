// ============================================================
// ALGEMENE SITE-INSTELLINGEN
// Pas hier naam, contactgegevens, links en teksten aan.
// Laat de veldnamen (links) ongewijzigd, enkel de waarden (rechts).
// ============================================================

export const siteConfig = {
  // Naam van het project, gebruikt in header, footer en SEO.
  projectName: "De Sterkste Boom van Rendestede",

  // Korte tagline, gebruikt in meta-omschrijvingen.
  tagline:
    "Sportieve uitdagingen voor Kom op tegen Kanker, ter nagedachtenis van de sterkste boom van Rendestede.",

  // Definitief domein. Pas dit aan zodra het domein gekoppeld is.
  url: "https://desterksteboomvanrendestede.be",

  // Contact — bewust een apart projectadres.
  email: "desterksteboomvanrendestede@outlook.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61592009188050",

  // Officiële actiepagina van Kom op tegen Kanker. Alle donaties lopen hierlangs.
  donationUrl:
    "https://www.komoptegenkanker.be/de-1000km/steun-een-team/15134507-d200-4e8b-b701-48deba8ba3fe",

  // Initiatiefnemer
  initiatiefnemer: "Koen Van Ongeval",

  // Formulierendpoint. Leeg = formulieren worden verborgen en vervangen
  // door een duidelijke mailknop. Standaard: FormSubmit (geen account nodig;
  // de eerste inzending stuurt eenmalig een activatiemail naar het e-mailadres
  // hierboven — bevestig die en het formulier werkt).
  // Kan overschreven worden via de omgevingsvariabele PUBLIC_FORM_ENDPOINT.
  formEndpoint:
    import.meta.env.PUBLIC_FORM_ENDPOINT ||
    "https://formsubmit.co/desterksteboomvanrendestede@outlook.com",

  // Cloudflare Turnstile — spambeveiliging op het contactformulier.
  // De widget is cookievrij en privacyvriendelijk (geen Google reCAPTCHA).
  //
  // ⚠️ VERVANG DE TESTSLEUTEL HIERONDER DOOR JE EIGEN SITE KEY.
  // De standaardwaarde is Cloudflare's *testsleutel* die ALTIJD slaagt en dus
  // GEEN echte bescherming biedt. Maak een widget aan op
  // https://dash.cloudflare.com/?to=/:account/turnstile (voeg het domein
  // desterksteboomvanrendestede.be toe) en zet hier je echte site key,
  // of stel de omgevingsvariabele PUBLIC_TURNSTILE_SITE_KEY in.
  // Laat leeg ("") om de captcha volledig uit te schakelen.
  turnstileSiteKey:
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",

  // Sleuteldata voor de afteltellers op de site. Pas aan zodra exacte data
  // bekend zijn. Laat op null wanneer een datum nog niet vastligt.
  keyDates: {
    everesting: "2026-09-12" as string | null,
    duizendKm: "2027-05-06" as string | null,
  },
};

export type SiteConfig = typeof siteConfig;
