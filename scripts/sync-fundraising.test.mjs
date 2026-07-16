// Tests voor de fondsenwerving-sync. Draaien met: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseEuro, extractAmount, fetchWithTimeout } from "./sync-fundraising.mjs";

test("parseEuro: € 2.830,00 -> 2830", () => {
  assert.equal(parseEuro("€ 2.830,00"), 2830);
});

test("parseEuro: € 0,00 -> 0", () => {
  assert.equal(parseEuro("€ 0,00"), 0);
});

test("parseEuro: € 12.345,67 -> 12345.67", () => {
  assert.equal(parseEuro("€ 12.345,67"), 12345.67);
});

test("parseEuro: onzin -> null", () => {
  assert.equal(parseEuro("geen bedrag"), null);
  assert.equal(parseEuro(""), null);
  assert.equal(parseEuro(null), null);
});

test("extractAmount: correcte HTML met selector", () => {
  const html = `
    <div class="team-page__funds">
      <span class="amount d-block">&euro; 2.830,00</span>
      ingezameld
    </div>`;
  const r = extractAmount(html);
  assert.equal(r.ok, true);
  assert.equal(r.value, 2830);
});

test("extractAmount: € 0,00 is geldig", () => {
  const html = `<div class="team-page__funds"><span class="amount">&euro; 0,00</span></div>`;
  const r = extractAmount(html);
  assert.equal(r.ok, true);
  assert.equal(r.value, 0);
});

test("extractAmount: ontbrekende selector -> niet ok", () => {
  const r = extractAmount(`<div class="other"><span>&euro; 100,00</span></div>`);
  assert.equal(r.ok, false);
});

test("extractAmount: lege response -> niet ok", () => {
  assert.equal(extractAmount("").ok, false);
  assert.equal(extractAmount(null).ok, false);
});

test("extractAmount: ongeldige/kapotte HTML -> niet ok", () => {
  const r = extractAmount("<div><span class='amount'>onbekend");
  assert.equal(r.ok, false);
});

test("extractAmount: selector aanwezig maar geen bedrag -> niet ok", () => {
  const html = `<div class="team-page__funds"><span class="amount">binnenkort</span></div>`;
  assert.equal(extractAmount(html).ok, false);
});

test("extractAmount: tekst-fallback bij 'ingezameld' zonder selector", () => {
  const html = `<main><p>&euro; 2.830,00 ingezameld door dit team</p></main>`;
  const r = extractAmount(html);
  assert.equal(r.ok, true);
  assert.equal(r.value, 2830);
});

test("fetchWithTimeout: breekt af na timeout", async () => {
  // Nep-fetch die nooit antwoordt, maar de abort-signal respecteert.
  const nooitKlaar = (_url, { signal }) =>
    new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => reject(new Error("aborted")));
    });
  await assert.rejects(() => fetchWithTimeout("https://example.test", 20, nooitKlaar));
});
