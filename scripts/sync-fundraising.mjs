// ============================================================
// SYNC FONDSENWERVING — leest het opgehaalde bedrag van de officiële
// Kom op tegen Kanker-actiepagina (server-side) en werkt
// src/data/fundraising.json bij.
//
// Bron van waarheid: de KOTK-teampagina. Het bedrag staat server-side in
// de HTML, in de selector `.team-page__funds .amount` (bv. "€ 2.830,00").
//
// Robuust ontworpen (zie eisen):
//  - uitsluitend server-side ophalen (geen browser-fetch);
//  - HTML parsen met Cheerio;
//  - bij netwerkfout / timeout / gewijzigde HTML / ontbrekende selector /
//    ongeldige waarde: het laatst opgeslagen (geldige) bedrag blijft staan;
//  - een geldig bedrag wordt nooit met 0 overschreven door een fout;
//  - duidelijke waarschuwing bij mislukte parsing;
//  - handmatige fallbackwaarde blijft in fundraising.json staan.
//
// Draait op GitHub Actions (zie .github/workflows/sync-fundraising.yml),
// waar uitgaand internet beschikbaar is. Lokaal: node scripts/sync-fundraising.mjs
// ============================================================

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as cheerio from "cheerio";

export const SOURCE_URL =
  process.env.KOTK_URL ||
  "https://www.komoptegenkanker.be/de-1000km/steun-een-team/15134507-d200-4e8b-b701-48deba8ba3fe";

const FILE = fileURLToPath(new URL("../src/data/fundraising.json", import.meta.url));
const SELECTOR = ".team-page__funds .amount";
const TIMEOUT_MS = 15_000;

/**
 * Zet een BE-euro-tekst om naar een getal.
 *   "€ 2.830,00"  -> 2830
 *   "€ 0,00"      -> 0
 *   "€ 12.345,67" -> 12345.67
 * Punt = duizendtalscheiding, komma = decimaalteken.
 * Geeft null terug wanneer er geen geldig bedrag in zit.
 */
export function parseEuro(raw) {
  if (raw == null) return null;
  const text = String(raw).replace(/ /g, " ");
  const match = text.match(/-?\d[\d.]*(?:,\d+)?/);
  if (!match) return null;
  const normalized = match[0].replace(/\./g, "").replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

/**
 * Haalt het opgehaalde bedrag uit de HTML via de selector.
 * Geeft { ok, value, text } of { ok:false, reason }.
 */
export function extractAmount(html) {
  if (!html || typeof html !== "string") {
    return { ok: false, reason: "lege of ongeldige respons" };
  }
  const $ = cheerio.load(html);
  const el = $(SELECTOR).first();
  if (el.length === 0) {
    // Reserve: zoek een eurobedrag vlak bij het woord "ingezameld" in de
    // platte tekst (werkt ook wanneer een proxy de opmaak wijzigt).
    const flat = $.text().replace(/\s+/g, " ");
    const near =
      flat.match(/(€\s*[\d.,]+)\s*ingezameld/i) ||
      flat.match(/ingezameld[^€]{0,30}(€\s*[\d.,]+)/i);
    if (near) {
      const value = parseEuro(near[1]);
      if (value != null && value >= 0) {
        return { ok: true, value, text: near[1].trim(), via: "tekst-fallback" };
      }
    }
    return { ok: false, reason: `selector "${SELECTOR}" niet gevonden` };
  }
  const text = el.text().trim();
  const value = parseEuro(text);
  if (value == null || value < 0) {
    return { ok: false, reason: `ongeldige waarde: "${text}"`, text };
  }
  return { ok: true, value, text };
}

/** fetch met harde timeout via AbortController (server-side). */
export async function fetchWithTimeout(url, ms = TIMEOUT_MS, fetchImpl = fetch, extraHeaders = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetchImpl(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        ...extraHeaders,
        // Browserechte headers: sommige sites geven bots een 404/403.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "nl-BE,nl;q=0.9,en;q=0.8",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Haalt de pagina op met een ECHTE headless browser (Playwright/Chromium):
 * volwaardige TLS-vingerafdruk + JavaScript-uitvoering. Dit is de beste kans
 * tegen botdetectie die een kale fetch of scraper-proxy een 404 geeft.
 * Geeft de HTML terug, of null wanneer Playwright niet beschikbaar is
 * (bv. lokaal / in de unit-tests) of de navigatie faalt.
 */
export async function fetchViaBrowser(url, timeoutMs = 45_000) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.log("Playwright niet geïnstalleerd — browserroute overgeslagen.");
    return null;
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      locale: "nl-BE",
      viewport: { width: 1366, height: 900 },
    });
    const page = await context.newPage();
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    console.log(`browser (Playwright) — HTTP ${resp ? resp.status() : "?"}`);
    // Geef de pagina even tijd om het bedrag te renderen; val terug op de HTML.
    await page.waitForSelector(SELECTOR, { timeout: 10_000 }).catch(() => {});
    return await page.content();
  } finally {
    await browser.close();
  }
}

/** Browserroute: haal op via Playwright en probeer het bedrag te herkennen. */
async function tryBrowserRoute(url) {
  let html = null;
  try {
    html = await fetchViaBrowser(url);
  } catch (err) {
    console.warn(`WAARSCHUWING: browser (Playwright) mislukt (${err.name}: ${err.message}).`);
    return null;
  }
  if (!html) return null;
  const attempt = extractAmount(html);
  if (attempt.ok) return attempt;
  const peek = html.replace(/\s+/g, " ").slice(0, 300);
  console.warn(
    `WAARSCHUWING: browser (Playwright) gaf inhoud (${html.length} tekens) maar ${attempt.reason}. Begin: ${peek}`,
  );
  return null;
}

/** Schrijft een handmatig opgegeven bedrag weg (reserveweg wanneer KOTK
 *  geautomatiseerde toegang blokkeert). Geactiveerd via KOTK_MANUAL_AMOUNT. */
function applyManualAmount(current, raw) {
  const value = parseEuro(raw);
  if (value == null || value < 0) {
    console.warn(`WAARSCHUWING: handmatig bedrag "${raw}" is ongeldig — genegeerd.`);
    return false;
  }
  if (value === current.raised) {
    console.log("Handmatig bedrag gelijk aan huidige waarde — niets bijgewerkt.");
    return true;
  }
  const now = new Date();
  current.raised = value;
  current.lastUpdated = now.toISOString().slice(0, 10);
  current.fetchedAt = now.toISOString();
  current.status = "manual";
  current.sourceText = `€ ${value.toLocaleString("nl-BE")}`;
  writeFileSync(FILE, JSON.stringify(current, null, 2) + "\n");
  console.log(`fundraising.json handmatig bijgewerkt: opgehaald -> €${current.raised}`);
  return true;
}

async function main() {
  const current = JSON.parse(readFileSync(FILE, "utf8"));
  console.log(`Huidig: opgehaald €${current.raised}, doel €${current.goal}`);

  // Handmatige override (via de "Run workflow"-knop): zet het bedrag direct,
  // zonder KOTK te bevragen. Nuttig wanneer KOTK bots blokkeert.
  const manual = (process.env.KOTK_MANUAL_AMOUNT || "").trim();
  if (manual) {
    applyManualAmount(current, manual);
    return;
  }

  // Route 1: rechtstreeks. Route 2 (reserve): via de Jina Reader-proxy, die
  // de pagina met een echte browser ophaalt — nodig wanneer de KOTK-firewall
  // datacenter-IP's (zoals GitHub Actions) blokkeert.
  const routes = [
    { name: "rechtstreeks", url: SOURCE_URL, headers: {} },
    {
      name: "render-proxy (html)",
      url: `https://r.jina.ai/${SOURCE_URL}`,
      headers: { "X-Return-Format": "html" },
      timeout: 60_000,
    },
    {
      name: "render-proxy (tekst)",
      url: `https://r.jina.ai/${SOURCE_URL}`,
      headers: {},
      timeout: 60_000,
    },
  ];

  // Route 0: échte browser (Playwright) — beste kans tegen botdetectie.
  let result = await tryBrowserRoute(SOURCE_URL);
  if (result) console.log("browser (Playwright): bedrag herkend.");

  // Reserveroutes (kale fetch / proxy): enkel wanneer de browser niets opleverde.
  for (const route of result ? [] : routes) {
    let html = null;
    for (let i = 1; i <= 2; i++) {
      try {
        const res = await fetchWithTimeout(route.url, route.timeout ?? TIMEOUT_MS, fetch, route.headers);
        console.log(`${route.name} — poging ${i}/2: HTTP ${res.status}`);
        if (res.ok) {
          html = await res.text();
          break;
        }
        console.warn(`WAARSCHUWING: HTTP ${res.status}.`);
      } catch (err) {
        console.warn(`WAARSCHUWING: ophalen mislukt (${err.name}: ${err.message}).`);
      }
      if (i < 2) await new Promise((r) => setTimeout(r, 3000));
    }
    if (html == null) continue;

    const attempt = extractAmount(html);
    if (attempt.ok) {
      result = attempt;
      break;
    }
    // Diagnostiek: laat zien wat deze route terugkreeg, zodat parsing
    // bijgestuurd kan worden zonder te gokken.
    const peek = html.replace(/\s+/g, " ").slice(0, 300);
    console.warn(
      `WAARSCHUWING: ${route.name} gaf inhoud (${html.length} tekens) maar ${attempt.reason}. Begin: ${peek}`,
    );
  }

  if (result == null) {
    console.warn("Bedrag blijft ongewijzigd (geen route leverde een herkenbaar bedrag).");
    return;
  }

  console.log(`Herkend bedrag: "${result.text}" -> ${result.value}`);

  // Veiligheid: een geldig, positief bedrag nooit laten terugvallen naar 0.
  if (result.value === 0 && current.raised > 0) {
    console.warn(
      "WAARSCHUWING: bron gaf €0 terwijl er al een positief bedrag stond — genegeerd (mogelijke fout).",
    );
    return;
  }

  if (result.value === current.raised) {
    console.log("Bedrag ongewijzigd — niets bijgewerkt.");
    return;
  }

  const now = new Date();
  current.raised = result.value;
  current.lastUpdated = now.toISOString().slice(0, 10);
  current.fetchedAt = now.toISOString();
  current.sourceUrl = SOURCE_URL;
  current.status = "ok";
  current.sourceText = result.text;

  writeFileSync(FILE, JSON.stringify(current, null, 2) + "\n");
  console.log(`fundraising.json bijgewerkt: opgehaald -> €${current.raised}`);
}

// Alleen uitvoeren wanneer rechtstreeks aangeroepen (niet bij import in tests).
if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  await main();
}
