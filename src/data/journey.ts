// ============================================================
// DE REIS — "Op weg naar de 1000 km"
// De tijdlijn van het verhaal. Volgorde in deze lijst = volgorde
// op de site. Eén item = één stap. Voeg gerust stappen toe of pas
// bestaande aan; de tijdlijn op de site volgt automatisch.
//
//  status:
//    "done"     = achter de rug
//    "current"  = waar we nu staan
//    "upcoming" = nog te gaan
//
//  date (optioneel): ISO-datum (JJJJ-MM-DD) voor sortering en tellers.
//  Laat leeg wanneer er nog geen exacte datum is; gebruik dan 'label'.
// ============================================================

export interface JourneyStep {
  label: string;
  date?: string;
  icon: string;
  title: string;
  tagline?: string;
  description?: string;
  status: "done" | "current" | "upcoming";
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
    status: "done",
  },
  {
    label: "1 juni 2026",
    date: "2026-06-01",
    icon: "🌱",
    title: "De Sterkste Boom van Rendestede ontstaat",
    tagline: "Uit verdriet groeit een nieuw doel.",
    description:
      "Het project wordt geboren: een initiatief om via sportieve uitdagingen en acties geld in te zamelen voor Kom op tegen Kanker, ter nagedachtenis van papa.",
    status: "done",
  },
  {
    label: "19 juni 2026",
    date: "2026-06-19",
    icon: "🚴",
    title: "Inschrijving voor De 1000 km",
    tagline: "De officiële inschrijving voor De 1000 km voor Kom op tegen Kanker is een feit.",
    description:
      "Vanaf nu krijgt het project een duidelijk einddoel: in mei 2027 solo deelnemen aan De 1000 km.",
    status: "done",
  },
  {
    label: "Juli 2026",
    date: "2026-07-01",
    icon: "🤝",
    title: "De eerste partners sluiten aan",
    tagline: "Lokale handelaars, bedrijven, familie en vrienden geloven in het verhaal.",
    description:
      "De eerste samenwerkingen zorgen ervoor dat het project steeds verder kan groeien.",
    status: "done",
  },
  {
    label: "Juli 2026",
    date: "2026-07-16",
    icon: "🌐",
    title: "Website en sociale media online",
    tagline: "Het verhaal krijgt een thuis.",
    description:
      "De website desterksteboomvanrendestede.be en de Facebookpagina gaan online. Vanaf nu kan iedereen het verhaal volgen, acties ontdekken en het project steunen.",
    status: "current",
  },
  {
    label: "12 september 2026",
    date: "2026-09-12",
    icon: "⛰️",
    title: "Everesting Congoberg",
    tagline: "De eerste grote sportieve uitdaging.",
    description:
      "8.848 hoogtemeters op de Congoberg in het Pajottenland, volledig ten voordele van Kom op tegen Kanker.",
    status: "upcoming",
  },
  {
    label: "Januari 2027",
    icon: "🧇",
    title: "Wafelenbak voor Kom op tegen Kanker",
    tagline: "Details worden nog bekendgemaakt.",
    description:
      "Samen met familie, vrienden en vrijwilligers organiseren we een wafelenbak om extra fondsen in te zamelen.",
    status: "upcoming",
  },
  {
    label: "6 mei 2027",
    date: "2027-05-06",
    icon: "🏁",
    title: "De 1000 km voor Kom op tegen Kanker",
    tagline: "Het doel waar alles naartoe heeft gewerkt.",
    description:
      "Een solo-deelname aan De 1000 km voor Kom op tegen Kanker, gedragen door iedereen die onderweg mee het verschil maakte.",
    status: "upcoming",
  },
];
