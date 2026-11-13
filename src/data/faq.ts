// ============================================================
// VEELGESTELDE VRAGEN (homepage)
// Deze teksten verschijnen zichtbaar op de homepage én als "FAQPage"
// structured data voor zoekmachines en AI-assistenten.
// INHOUD: elke wijziging hier eerst laten goedkeuren door Koen.
// Feiten (datum, adres, prijs) komen uit site-config.ts, zodat ze maar op
// één plek aangepast moeten worden.
// ============================================================
import { siteConfig } from "./site-config";

const w = siteConfig.wafelenbak;
const euro = (n: number) =>
  new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

export interface FaqItem {
  vraag: string;
  antwoord: string;
}

export const faq: FaqItem[] = [
  {
    vraag: "Wat is De Sterkste Boom van Rendestede?",
    antwoord:
      "De Sterkste Boom van Rendestede is een persoonlijk fietsproject van Koen Van Ongeval ten voordele van Kom op tegen Kanker. Met sportieve uitdagingen, acties en evenementen zamelt Koen geld in, ter nagedachtenis van zijn papa Cyriel.",
  },
  {
    vraag: "Waar komt de naam vandaan?",
    antwoord:
      "Voor wie hem kende, was Cyriel de sterkste boom van Rendestede: iemand waarop je kon bouwen en die er stond wanneer anderen hem nodig hadden. Daarom draagt het project zijn naam.",
  },
  {
    vraag: "Hoe kan ik het project steunen?",
    antwoord:
      "Je kan een gift doen via de officiële actiepagina van Kom op tegen Kanker. Bedrijven en organisaties kunnen ook steunpilaar worden met financiële, materiële of logistieke steun, of door het project mee bekend te maken.",
  },
  {
    vraag: "Waar gaat mijn gift naartoe?",
    antwoord:
      "Alle giften verlopen veilig via de officiële actiepagina van Kom op tegen Kanker en gaan dus rechtstreeks naar Kom op tegen Kanker. Deze website verwerkt zelf geen betalingen.",
  },
  {
    vraag: "Wat is De 1000 km voor Kom op tegen Kanker?",
    antwoord:
      "De 1000 km is het fietsevenement van Kom op tegen Kanker. In mei 2027 neemt Koen eraan deel; het is het grote doel waar het hele project naartoe werkt.",
  },
  {
    vraag: "Wanneer en waar is de wafelenbak?",
    antwoord: `De wafelenbak vindt plaats op ${w.datum.charAt(0).toLowerCase() + w.datum.slice(1)}, bij ${w.locatie}. Je kan ter plaatse wafels eten of afhaalpakketten bestellen; een ${w.eenheidEnkelvoud} kost ${euro(w.prijsPerWafel)}. Registreren kan via de wafelenbakpagina op deze website.`,
  },
  {
    vraag: "Gaat de Everesting op de Congoberg nog door?",
    antwoord:
      "Nee. De Everesting van 12 september 2026 is geannuleerd na een val tijdens een trainingsrit en een operatie aan het sleutelbeen. Het engagement voor Kom op tegen Kanker blijft.",
  },
];
