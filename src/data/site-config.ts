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

  // Contact
  email: "koen_vanongeval@hotmail.com",
  facebookUrl: "https://www.facebook.com/profile.php?id=61592009188050",

  // Officiële actiepagina van Kom op tegen Kanker. Alle donaties lopen hierlangs.
  donationUrl:
    "https://www.komoptegenkanker.be/de-1000km/steun-een-team/15134507-d200-4e8b-b701-48deba8ba3fe",

  // Initiatiefnemer
  initiatiefnemer: "Koen Van Ongeval",

  // Formulierendpoint (bv. Formspree). Leeg = formulieren worden verborgen
  // en vervangen door een duidelijke mailknop. Zie CONTENT-BEHEREN.md.
  // Kan hier rechtstreeks ingevuld worden, of via de omgevingsvariabele
  // PUBLIC_FORM_ENDPOINT (zie .env.example). De omgevingsvariabele heeft voorrang.
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || "", // TODO: Formspree-endpoint invullen, bv. "https://formspree.io/f/xxxxxxx"

  // Sleuteldata voor de afteltellers op de site. Pas aan zodra exacte data
  // bekend zijn. Laat op null wanneer een datum nog niet vastligt.
  keyDates: {
    everesting: "2026-09-12" as string | null,
    duizendKm: null as string | null, // TODO: datum invullen zodra bekend
  },
};

export type SiteConfig = typeof siteConfig;
