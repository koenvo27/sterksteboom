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

  // Wafelenbak — bestel-/registratieformulier. Betaling verloopt via de
  // officiële actiepagina van Kom op tegen Kanker (geen betaling op de site
  // zelf; de site kan geen geld innen). Prijs per pakket = aantal wafels ×
  // prijs per wafel. Laat datum/locatie/afhaalInfo leeg tot ze vastliggen —
  // lege velden worden netjes verborgen (geen verzonnen data op de site).
  wafelenbak: {
    prijsPerPakket: 12.5,
    wafelsPerPakket: 5,
    prijsPerWafel: 2.5,
    // Verkochte eenheid (zoals op de affiche): een dubbele wafel aan 2,5 euro.
    eenheidEnkelvoud: "dubbele wafel",
    eenheidMeervoud: "dubbele wafels",
    // Betaallink: de teampagina van Kom op tegen Kanker. Stel dit in op een
    // specifieke "Wafelenbak"-actiepagina zodra die bestaat, dan is de
    // afstemming van betalingen eenvoudiger.
    betaalUrl:
      "https://www.komoptegenkanker.be/de-1000km/steun-een-team/15134507-d200-4e8b-b701-48deba8ba3fe",
    // Registratie-endpoint. Leeg = registraties gaan via FormSubmit (e-mail).
    // Google Apps Script "web-app"-URL (eindigt op /exec) die registraties
    // rechtstreeks in een Google Sheet bewaart. Deze URL is bewust publiek
    // (de browser moet ernaartoe kunnen posten); hij bevat geen geheim.
    // Kan overschreven worden via de omgevingsvariabele PUBLIC_WAFEL_ENDPOINT.
    registratieEndpoint:
      import.meta.env.PUBLIC_WAFEL_ENDPOINT ||
      "https://script.google.com/macros/s/AKfycbyG2erDtFAfz_ozbNC_ezYLp5edkcdUcd7eV6iB18iYlpzNJ4_-7i-GsHLEIpBXpFmJlQ/exec",
    datum: "Zaterdag 23 januari 2027, van 14u00 tot 18u00",
    // Machine-leesbare datum (JJJJ-MM-DD) voor de logica: de homepage-highlight
    // en de aankondigingsbalk tonen zichzelf tot en met deze dag en verdwijnen
    // daarna vanzelf. Leeg = overal verborgen.
    datumISO: "2027-01-23",
    locatie: "Melkveebedrijf De Dyn – Heremans, Rijstraat 193, 9400 Denderwindeke (Ninove)",
    afhaalInfo: "Afhalen kan op zaterdag 23 januari, ook vanaf 17u30.",
  },

  // Sleuteldata voor de afteltellers op de site. Pas aan zodra exacte data
  // bekend zijn. Laat op null wanneer een datum nog niet vastligt.
  keyDates: {
    // De Everesting van 12 september 2026 is geannuleerd (blessure). Geen
    // afteller meer naar dat event. Op null zetten verbergt de countdown overal.
    everesting: null as string | null,
    duizendKm: "2027-05-06" as string | null,
  },
};

export type SiteConfig = typeof siteConfig;
