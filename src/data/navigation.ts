// ============================================================
// HOOFDNAVIGATIE
// Volgorde in deze lijst = volgorde in het menu.
// ============================================================

export interface NavItem {
  label: string;
  href: string;
}

// Compact hoofdmenu. De gele "Steun het project"-knop staat apart in de
// header (rechtstreeks naar Kom op tegen Kanker) en zit dus niet in deze lijst.
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Het verhaal", href: "/het-verhaal" },
  { label: "De uitdagingen", href: "/uitdagingen" },
  // "De reis" is de korte menutekst; de paginatitel blijft "Op weg naar de 1000 km".
  { label: "De reis", href: "/op-weg-naar-de-1000-km" },
  { label: "Onze steunpilaren", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

// "Steunen" (/steunen) staat bewust niet in het hoofdmenu, maar blijft goed
// bereikbaar via de gele steunknop, Onze steunpilaren, de CTA's op de homepage,
// deze footer en de uitdagingenpagina's.
// Dagboek staat voorlopig verborgen (geen navigatie, niet in de sitemap).
export const footerNav: NavItem[] = [
  ...mainNav,
  { label: "Steunen", href: "/steunen" },
];
