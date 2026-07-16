// ============================================================
// SYNC FONDSENWERVING — leest het opgehaalde bedrag (en indien mogelijk
// het streefbedrag) van de officiële Kom op tegen Kanker-actiepagina en
// werkt src/data/fundraising.json bij.
//
// Veilig ontworpen: als er geen bedrag betrouwbaar herkend wordt, blijft
// het bestaande (handmatige) bedrag staan. Zo toont de site nooit een
// verzonnen of leeg bedrag.
//
// Draait op GitHub Actions (zie .github/workflows/sync-fundraising.yml),
// waar uitgaand internet wél beschikbaar is. Lokaal testen kan ook:
//   node scripts/sync-fundraising.mjs
// ============================================================

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const FILE = fileURLToPath(new URL("../src/data/fundraising.json", import.meta.url));
const URL_ =
  process.env.KOTK_URL ||
  "https://www.komoptegenkanker.be/de-1000km/steun-een-team/15134507-d200-4e8b-b701-48deba8ba3fe";

/** "€ 1.234,56" of "1.234" (BE-formaat: punt = duizendtal, komma = decimaal) -> number */
function parseEuro(raw) {
  if (!raw) return null;
  const cleaned = String(raw)
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "") // duizendtalpunten weg
    .replace(",", ".");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function extract(html) {
  const text = html.replace(/\s+/g, " ");
  const candidates = { raised: null, goal: null, notes: [] };

  // 1) "€ X van € Y"  of  "€ X / € Y"  (opgehaald van doel)
  const vanMatch = text.match(
    /€\s*([\d.,]+)\s*(?:van|\/)\s*€?\s*([\d.,]+)/i,
  );
  if (vanMatch) {
    candidates.raised = parseEuro(vanMatch[1]);
    candidates.goal = parseEuro(vanMatch[2]);
    candidates.notes.push(`patroon "X van Y": ${vanMatch[0]}`);
  }

  // 2) bedrag vlak bij "opgehaald" / "ingezameld"
  if (candidates.raised == null) {
    const m =
      text.match(/€\s*([\d.,]+)[^€]{0,40}?(?:opgehaald|ingezameld)/i) ||
      text.match(/(?:opgehaald|ingezameld)[^€]{0,40}?€\s*([\d.,]+)/i);
    if (m) {
      candidates.raised = parseEuro(m[1]);
      candidates.notes.push(`patroon "opgehaald": ${m[0]}`);
    }
  }

  // 3) streefbedrag / doel
  if (candidates.goal == null) {
    const m =
      text.match(/(?:streefbedrag|doel|target)[^€]{0,40}?€\s*([\d.,]+)/i) ||
      text.match(/€\s*([\d.,]+)[^€]{0,30}?(?:streefbedrag|doel)/i);
    if (m) {
      candidates.goal = parseEuro(m[1]);
      candidates.notes.push(`patroon "streefbedrag": ${m[0]}`);
    }
  }

  // Log alle euro-bedragen die op de pagina staan (helpt bij afstellen).
  const all = [...text.matchAll(/€\s*[\d.,]+/g)].map((x) => x[0]).slice(0, 20);
  candidates.notes.push(`alle euro-bedragen (max 20): ${all.join(" | ") || "geen"}`);

  return candidates;
}

async function main() {
  const current = JSON.parse(readFileSync(FILE, "utf8"));
  console.log(`Huidig: opgehaald €${current.raised}, doel €${current.goal}`);
  console.log(`Ophalen: ${URL_}`);

  let html = "";
  try {
    const res = await fetch(URL_, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SterksteBoomBot/1.0; +https://desterksteboomvanrendestede.be)",
        "Accept-Language": "nl-BE,nl;q=0.9",
      },
    });
    console.log(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.log(`Ophalen mislukt: ${err.message}. Bedrag blijft ongewijzigd.`);
    return;
  }

  const found = extract(html);
  found.notes.forEach((n) => console.log(" -", n));

  let changed = false;
  // Alleen bijwerken wanneer we een plausibel, positief bedrag herkennen.
  if (found.raised != null && found.raised >= 0 && found.raised !== current.raised) {
    console.log(`Opgehaald: €${current.raised} -> €${found.raised}`);
    current.raised = found.raised;
    changed = true;
  }
  if (found.goal != null && found.goal > 0 && found.goal !== current.goal) {
    console.log(`Doel: €${current.goal} -> €${found.goal}`);
    current.goal = found.goal;
    changed = true;
  }

  if (!changed) {
    console.log(
      "Geen betrouwbare wijziging gevonden — bestaand bedrag blijft behouden.",
    );
    return;
  }

  current.lastUpdated = new Date().toISOString().slice(0, 10);
  writeFileSync(FILE, JSON.stringify(current, null, 2) + "\n");
  console.log("fundraising.json bijgewerkt.");
}

await main();
