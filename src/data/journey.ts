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
  description?: string;
  status: "done" | "current" | "upcoming";
}

export const journey: JourneyStep[] = [
  {
    label: "Begin 2026",
    icon: "🌱",
    title: "Afscheid van papa",
    description:
      "Begin 2026 verloor ik mijn papa Cyriel veel te snel aan een agressieve vorm van kanker. Voor velen was hij de sterkste boom van Rendestede.",
    status: "done",
  },
  {
    label: "Juli 2026",
    date: "2026-07-15",
    icon: "🚴",
    title: "Het project start",
    description:
      "De Sterkste Boom van Rendestede gaat van start: in beweging komen in plaats van stil te blijven staan.",
    status: "current",
  },
  {
    label: "2026",
    icon: "🤝",
    title: "Partners sluiten aan",
    description:
      "Mensen, bedrijven en organisaties worden steunpilaren en dragen het verhaal mee.",
    status: "upcoming",
  },
  {
    label: "12 september 2026",
    date: "2026-09-12",
    icon: "⛰️",
    title: "Everesting op de Congoberg",
    description:
      "De hoogte van de Mount Everest bijeen fietsen op de Congoberg — de eerste grote sportieve uitdaging.",
    status: "upcoming",
  },
  {
    label: "Najaar 2026",
    icon: "🧇",
    title: "Wafelenbak",
    description: "Een warme, lokale actie ten voordele van Kom op tegen Kanker.",
    status: "upcoming",
  },
  {
    label: "2027",
    icon: "🚴",
    title: "De 1000 km voor Kom op tegen Kanker",
    description:
      "Het einddoel: solo deelnemen aan De 1000 km voor Kom op tegen Kanker.",
    status: "upcoming",
  },
];
