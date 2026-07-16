// ============================================================
// DE REIS — "Op weg naar de 1000 km"
// De tijdlijn van het verhaal. Volgorde in deze lijst = volgorde
// op de site (chronologisch). Eén item = één stap.
//
// STATUS WORDT AUTOMATISCH BEREKEND op basis van de datum (zie
// journeyWithStatus hieronder): alles met een datum in het verleden is
// "done", de meest recente bereikte mijlpaal is "current", de rest is
// "upcoming". Zo blijft de tijdlijn vanzelf kloppen — je hoeft na een
// mijlpaal niets handmatig aan te passen.
//
//  - date (optioneel): ISO-datum (JJJJ-MM-DD). Voor maandmijlpalen zonder
//    exacte dag gebruik je de 1e van de maand; de zichtbare tekst blijft
//    'label'. Zonder datum telt een stap niet mee voor de statusberekening.
//  - homepage: true  -> tonen in de compacte homepage-tijdlijn.
//  - statusOverride   -> forceer een status handmatig (zelden nodig). Zorg dat
//    er dan nog steeds hoogstens één item "current" is.
// ============================================================

export type JourneyStatus = "done" | "current" | "upcoming";

export interface JourneyStep {
  label: string;
  date?: string;
  icon: string;
  title: string;
  tagline?: string;
  description?: string;
  homepage?: boolean;
  statusOverride?: JourneyStatus;
}

export const journey: JourneyStep[] = [
  {
    label: "4 februari 2026",
    date: "2026-02-04",
    icon: "💛",
    title: "Afscheid van papa",
    tagline: "Mijn papa, Cyriel Van Ongeval, overlijdt aan een bijzonder agressieve vorm van kanker.",
    description:
      "Voor velen was hij de sterkste boom van Rendestede. Zijn kracht en doorzettingsvermogen vormen vanaf nu de inspiratie voor alles wat volgt.",
    homepage: true,
  },
  {
    label: "1 juni 2026",
    date: "2026-06-01",
    icon: "🌱",
    title: "De Sterkste Boom van Rendestede ontstaat",
    tagline: "Uit verdriet groeit een nieuw doel.",
    description:
      "Ik start het project om via sportieve uitdagingen en acties geld in te zamelen voor Kom op tegen Kanker, ter nagedachtenis van papa.",
    homepage: true,
  },
  {
    label: "19 juni 2026",
    date: "2026-06-19",
    icon: "🚴",
    title: "Inschrijving voor De 1000 km",
    tagline: "De inschrijving voor De 1000 km voor Kom op tegen Kanker is een feit.",
    description: "Vanaf nu heeft de reis een duidelijk einddoel in mei 2027.",
  },
  {
    label: "Juli 2026",
    date: "2026-07-01",
    icon: "🤝",
    title: "De eerste steunpilaren sluiten aan",
    tagline: "Lokale handelaars, bedrijven, familie en vrienden geloven in het verhaal.",
    description: "Samen zorgen de eerste samenwerkingen ervoor dat het project verder kan groeien.",
  },
  {
    label: "Juli 2026",
    date: "2026-07-16",
    icon: "🌐",
    title: "Website en sociale media online",
    tagline: "Het verhaal krijgt een thuis.",
    description:
      "De website en de Facebookpagina gaan online. Vanaf nu kan iedereen het verhaal volgen, acties ontdekken en mee steunen.",
  },
  {
    label: "12 september 2026",
    date: "2026-09-12",
    icon: "⛰️",
    title: "Everesting Congoberg",
    tagline: "Mijn eerste grote sportieve uitdaging.",
    description:
      "8.848 hoogtemeters op de Congoberg in het Pajottenland, ten voordele van Kom op tegen Kanker.",
    homepage: true,
  },
  {
    label: "Januari 2027",
    date: "2027-01-01",
    icon: "🧇",
    title: "Wafelenbak voor Kom op tegen Kanker",
    tagline: "Details worden nog bekendgemaakt.",
    description:
      "Samen met familie, vrienden en vrijwilligers organiseren we een wafelenbak om extra fondsen in te zamelen.",
  },
  {
    label: "Mei 2027",
    date: "2027-05-01",
    icon: "🏁",
    title: "De 1000 km voor Kom op tegen Kanker",
    tagline: "Het doel waar alles naartoe werkt.",
    description:
      "In mei 2027 neem ik als enige deelnemer van mijn team deel aan De 1000 km voor Kom op tegen Kanker. Ik rijd daarbij mee in de officiële pelotons van Kom op tegen Kanker.",
    homepage: true,
  },
];

/**
 * Geeft de tijdlijn terug met een automatisch berekende status.
 * "current" = de meest recente stap met een datum in het verleden.
 * Zo staat er altijd hoogstens één stap op "current" en verschuift die
 * vanzelf mee met de tijd (tenzij een stap een statusOverride heeft).
 */
export function journeyWithStatus(
  now: number = Date.now(),
): (JourneyStep & { status: JourneyStatus })[] {
  const times = journey.map((s) => (s.date ? new Date(`${s.date}T00:00:00`).getTime() : null));

  let currentIndex = -1;
  times.forEach((t, i) => {
    if (t != null && t <= now) currentIndex = i;
  });

  return journey.map((step, i) => {
    let status: JourneyStatus;
    if (step.statusOverride) {
      status = step.statusOverride;
    } else if (i < currentIndex) {
      status = "done";
    } else if (i === currentIndex) {
      status = "current";
    } else {
      status = "upcoming";
    }
    return { ...step, status };
  });
}
