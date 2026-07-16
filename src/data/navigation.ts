// ============================================================
// HOOFDNAVIGATIE
// Volgorde in deze lijst = volgorde in het menu.
// ============================================================

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Het verhaal", href: "/het-verhaal" },
  { label: "De uitdagingen", href: "/uitdagingen" },
  { label: "Op weg naar de 1000 km", href: "/op-weg" },
  { label: "Onze steunpilaren", href: "/partners" },
  { label: "Steunen", href: "/steunen" },
  // Dagboek staat voorlopig verborgen. Terug tonen = deze regel toevoegen:
  // { label: "Dagboek", href: "/dagboek" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavItem[] = [
  ...mainNav,
  { label: "Privacyverklaring", href: "/privacy" },
  { label: "Cookiebeleid", href: "/cookies" },
  { label: "Disclaimer", href: "/disclaimer" },
];
