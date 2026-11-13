// ============================================================
// VEELGESTELDE VRAGEN (homepage)
// Deze teksten verschijnen zichtbaar op de homepage én als "FAQPage"
// structured data voor zoekmachines en AI-assistenten.
// INHOUD: elke wijziging hier eerst laten goedkeuren door Koen.
// Feiten (datum, adres, prijs) komen uit site-config.ts, zodat ze maar op
// één plek aangepast moeten worden.
// ============================================================
import { siteConfig } from "./site-config";
import fundraising from "./fundraising.json";

const w = siteConfig.wafelenbak;
const euro = (n: number) =>
  new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);
// Ronde doelbedragen zonder centen (zelfde bron als de teller).
const euroRond = (n: number) =>
  new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const startdoel = euroRond(fundraising.goal);
const ambitie = euroRond(fundraising.stretchGoal);

export interface FaqItem {
  vraag: string;
  antwoord: string;
}

export const faq: FaqItem[] = [
  {
    vraag: "Wat is De Sterkste Boom van Rendestede?",
    antwoord:
      "De Sterkste Boom van Rendestede is het initiatief van Koen Van Ongeval, gegroeid uit het verlies van zijn papa Cyriel. Koen wil dat verdriet omzetten in iets positiefs: met sportieve uitdagingen, acties en evenementen zamelt hij geld in voor Kom op tegen Kanker, in de hoop dat veel andere mensen in de toekomst wél de kans krijgen om te vechten en er bovenop te komen. Een kans die zijn papa niet kreeg.",
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
    antwoord: `De 1000 km is het fietsevenement van Kom op tegen Kanker en het grote doel waar alles naartoe werkt. In mei 2027 rijdt Koen mee in de officiële pelotons, als enige deelnemer van zijn team. Achter hem staan familie, vrienden en steunpilaren, maar er is geen ploeg van fietsers om het bedrag mee bijeen te brengen. Om te mogen starten is minstens ${startdoel} nodig; Koen mikt hoger en wil ${ambitie} inzamelen. Elke gift, groot of klein, maakt dus echt het verschil.`,
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
