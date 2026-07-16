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
  { label: "Ons verhaal", href: "/ons-verhaal" },
  { label: "Uitdagingen", href: "/uitdagingen" },
  { label: "Acties", href: "/acties" },
  { label: "Nieuws", href: "/nieuws" },
  { label: "Partners", href: "/partners" },
  { label: "Word partner", href: "/word-partner" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavItem[] = [
  ...mainNav,
  { label: "Privacyverklaring", href: "/privacy" },
  { label: "Cookiebeleid", href: "/cookies" },
  { label: "Disclaimer", href: "/disclaimer" },
];
