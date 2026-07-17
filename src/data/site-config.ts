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

  // Cloudflare Web Analytics — cookieloze, privacyvriendelijke statistieken.
  // Plak hier de beacon-token uit het Cloudflare-dashboard
  // (Analytics & Logs → Web Analytics → je site → JS-snippet, het "token").
  // Leeg ("") = geen analytics (er wordt dan geen enkel script geladen).
  // Kan ook via de omgevingsvariabele PUBLIC_CF_ANALYTICS_TOKEN.
  cloudflareAnalyticsToken:
    import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN ?? "11069ee8ec90409691e1b5bb18ca4237",

  // Sleuteldata voor de afteltellers op de site. Pas aan zodra exacte data
  // bekend zijn. Laat op null wanneer een datum nog niet vastligt.
  keyDates: {
    everesting: "2026-09-12" as string | null,
    duizendKm: "2027-05-06" as string | null,
  },
};

export type SiteConfig = typeof siteConfig;
