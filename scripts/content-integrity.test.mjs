// ============================================================
// INHOUDELIJKE BEWAKINGSTESTEN
// Deze testen bewaken afspraken die makkelijk per ongeluk sneuvelen bij
// tekstwijzigingen: het projecte-mailadres, de veilige 1000 km-formulering,
// de fondsenwervingsdoelen, de compacte navigatie, de datumgebaseerde
// tijdlijnstatus en het weren van placeholder-links (href="#").
//
// Ze lezen de bronbestanden als tekst/JSON (geen build nodig), zodat ze snel
// draaien in CI vóór de build.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const PROJECT_EMAIL = "desterksteboomvanrendestede@outlook.com";

test("site-config gebruikt het juiste projecte-mailadres", () => {
  const cfg = read("src/data/site-config.ts");
  assert.match(cfg, new RegExp(PROJECT_EMAIL.replace(/[.@]/g, "\\$&")));
  // Geen oud/privé adres meer laten staan.
  assert.doesNotMatch(cfg, /gmail\.com/i);
});

test("er staan geen oude e-mailadressen hardcoded in de src", () => {
  const files = walk(join(root, "src"));
  for (const f of files) {
    if (!/\.(astro|ts|md|json)$/.test(f)) continue;
    const txt = readFileSync(f, "utf8");
    // Het gmail-adres van de initiatiefnemer mag nergens in de site staan.
    assert.doesNotMatch(txt, /koenvanongeval@gmail\.com/i, `Oud e-mailadres in ${f}`);
  }
});

test("fondsenwerving: startdoel €5.500 en ambitie €10.000", () => {
  const data = JSON.parse(read("src/data/fundraising.json"));
  assert.equal(data.goal, 5500, "startdoel moet 5500 zijn");
  assert.equal(data.stretchGoal, 10000, "ambitie moet 10000 zijn");
  assert.ok(data.raised >= 0, "opgehaald bedrag mag niet negatief zijn");
  assert.ok(data.stretchGoal > data.goal, "ambitie moet boven het startdoel liggen");
});

test("fondsenwerving-component toont 'Samen richting' de ambitie", () => {
  const comp = read("src/components/FundraisingProgress.astro");
  assert.match(comp, /Samen richting/);
  // Verwijst naar zowel startdoel als ambitie.
  assert.match(comp, /Startdoel/);
  assert.match(comp, /ambitie/i);
});

test("1000 km-uitdaging: veilige formulering, geen onbevestigde claims", () => {
  const md = read("src/content/challenges/1000km-2027.md");
  assert.match(md, /enige deelnemer van mijn team/);
  assert.match(md, /offici[eë]le pelotons/);
  // Geen stellige/onbevestigde claims over exacte praktische details.
  assert.doesNotMatch(md, /1000\s*km in (?:é|e)(?:é|e)n dag/i);
});

test("Everesting: geen onbevestigde praktische claims meer", () => {
  const md = read("src/content/challenges/everesting-congoberg.md");
  // Bevestigde feiten blijven staan.
  assert.match(md, /8848|8\.848/);
  assert.match(md, /12 september 2026/);
  // Voorzichtige formulering over nog niet vastgelegde praktische afspraken.
  assert.match(md, /volgen zodra alles definitief is|definitief/i);
  // De eerder te stellige claims mogen niet terugkomen.
  assert.doesNotMatch(md, /doorlopende bevoorrading/i);
});

test("navigatie: compact hoofdmenu zonder los 'Steunen'-item", () => {
  const nav = read("src/data/navigation.ts");
  // Het hoofdmenu bevat 'De reis' die naar de lange route wijst.
  assert.match(nav, /\/op-weg-naar-de-1000-km/);
  // 'Steunen' zit in de footer, niet in mainNav.
  const mainNavBlock = nav.slice(nav.indexOf("mainNav"), nav.indexOf("footerNav"));
  assert.doesNotMatch(mainNavBlock, /label:\s*"Steunen"/);
});

test("tijdlijn: precies 4 momenten op de homepage", () => {
  const journey = read("src/data/journey.ts");
  // Alleen echte data-items tellen (met komma), niet de uitleg in commentaar.
  const count = (journey.match(/homepage:\s*true,/g) || []).length;
  assert.equal(count, 4, "homepage-tijdlijn moet exact 4 momenten tonen");
});

test("tijdlijn: status wordt datumgebaseerd berekend", () => {
  const journey = read("src/data/journey.ts");
  assert.match(journey, /journeyWithStatus/);
  // De status komt uit de berekening, niet uit hardgecodeerde per-stap velden.
  assert.doesNotMatch(journey, /status:\s*"(done|current|upcoming)"/);
});

test("tijdlijn-statusalgoritme: hoogstens één 'current', juiste volgorde", () => {
  // We herbouwen het kleine, pure algoritme uit journey.ts en toetsen het
  // gedrag tegen de echte datums uit de bron.
  const journey = read("src/data/journey.ts");
  const dates = [...journey.matchAll(/date:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
  assert.ok(dates.length >= 2, "verwacht meerdere gedateerde stappen");

  const statusesAt = (nowIso) => {
    const now = new Date(`${nowIso}T00:00:00`).getTime();
    const times = dates.map((d) => new Date(`${d}T00:00:00`).getTime());
    let current = -1;
    times.forEach((t, i) => {
      if (t <= now) current = i;
    });
    return times.map((_, i) => (i < current ? "done" : i === current ? "current" : "upcoming"));
  };

  // Op een datum tussen de eerste en laatste mijlpaal: precies één 'current'.
  const mid = statusesAt("2026-10-01");
  assert.equal(mid.filter((s) => s === "current").length, 1);
  // Alles vóór de current is 'done', alles erna 'upcoming'.
  const ci = mid.indexOf("current");
  assert.ok(mid.slice(0, ci).every((s) => s === "done"));
  assert.ok(mid.slice(ci + 1).every((s) => s === "upcoming"));

  // In de verre toekomst zijn alle mijlpalen bereikt: enkel de laatste is
  // 'current', de rest 'done' en er is niets meer 'upcoming'.
  const future = statusesAt("2099-01-01");
  assert.equal(future.filter((s) => s === "upcoming").length, 0);
  assert.equal(future.filter((s) => s === "current").length, 1);
  assert.equal(future[future.length - 1], "current");
});

test("geen placeholder-links (href=\"#\") in de src", () => {
  const files = walk(join(root, "src")).filter((f) => /\.(astro|ts|tsx)$/.test(f));
  for (const f of files) {
    const txt = readFileSync(f, "utf8");
    assert.doesNotMatch(txt, /href=("#"|\{`?#`?\})/, `Placeholder-link in ${f}`);
  }
});

test("dagboek en bedankt worden uit de sitemap gefilterd", () => {
  const cfg = read("astro.config.mjs");
  assert.match(cfg, /includes\("\/dagboek"\)/);
  assert.match(cfg, /includes\("\/bedankt"\)/);
});

test("dagboekpagina's staan op noindex", () => {
  assert.match(read("src/pages/dagboek/index.astro"), /noindex/);
  assert.match(read("src/pages/dagboek/[slug].astro"), /noindex/);
});

test("er bestaat een eigen 404-pagina met noindex", () => {
  const notFound = read("src/pages/404.astro");
  assert.match(notFound, /404/);
  assert.match(notFound, /noindex/);
});

test("contactformulier belooft geen bevestigingsmail", () => {
  const form = read("src/components/ContactForm.astro");
  assert.match(form, /doorgestuurd naar een bevestigingspagina/);
});

test("contactformulier: Cloudflare Turnstile-spambeveiliging aanwezig", () => {
  const form = read("src/components/ContactForm.astro");
  // Widget en configuratie via de site key uit site-config.
  assert.match(form, /cf-turnstile/);
  assert.match(form, /turnstileSiteKey|turnstileKey/);
  // FormSubmit's eigen (Google reCAPTCHA) captcha staat uit, zodat er geen
  // dubbele captcha of Google-cookies zijn.
  assert.match(form, /name="_captcha"\s+value="false"/);
});

test("Turnstile: site key configureerbaar via env met veilige degradatie", () => {
  const cfg = read("src/data/site-config.ts");
  assert.match(cfg, /turnstileSiteKey/);
  assert.match(cfg, /PUBLIC_TURNSTILE_SITE_KEY/);
});

test("privacy en cookies vermelden Cloudflare Turnstile", () => {
  assert.match(read("src/pages/privacy.astro"), /Turnstile/);
  assert.match(read("src/pages/cookies.astro"), /Turnstile/);
});

// Kleine, afhankelijkheidsvrije bestandswandelaar.
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
