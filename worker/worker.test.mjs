// End-to-end-achtige testen voor de contactformulier-Worker.
// We mocken globale fetch (Siteverify + FormSubmit) zodat we de volledige
// verwerking kunnen toetsen zonder netwerk.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "./src/index.js";

const ORIGIN = "https://desterksteboomvanrendestede.be";
const env = {
  TURNSTILE_SECRET_KEY: "test-secret",
  ALLOWED_ORIGINS: "https://desterksteboomvanrendestede.be,https://www.desterksteboomvanrendestede.be",
  TURNSTILE_HOSTNAMES: "desterksteboomvanrendestede.be,www.desterksteboomvanrendestede.be",
  TURNSTILE_ACTION: "contact",
  FORM_FORWARD_URL: "https://formsubmit.co/ajax/test",
};

// Installeer een mock voor globale fetch. `siteverify` en `forward` zijn instelbaar.
function mockFetch({ siteverify = { success: true, hostname: "desterksteboomvanrendestede.be", action: "contact" }, forwardOk = true } = {}) {
  const calls = { siteverify: 0, forward: 0 };
  globalThis.fetch = async (url) => {
    const u = String(url);
    if (u.includes("siteverify")) {
      calls.siteverify++;
      return new Response(JSON.stringify(siteverify), { status: 200 });
    }
    if (u.includes("formsubmit.co")) {
      calls.forward++;
      return new Response(JSON.stringify({ success: forwardOk ? "true" : "false" }), { status: forwardOk ? 200 : 500 });
    }
    return new Response("{}", { status: 200 });
  };
  return calls;
}

function formRequest(fields, { origin = ORIGIN } = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return new Request("https://worker.example/", {
    method: "POST",
    headers: { Origin: origin, "CF-Connecting-IP": `10.0.0.${Math.floor(Math.random() * 250)}` },
    body: fd,
  });
}

const validFields = {
  name: "Jan Peeters",
  email: "jan@example.com",
  category: "Algemene vraag",
  message: "Dit is een testbericht.",
  privacy: "on",
  "cf-turnstile-response": "dummy-token",
  _subject: "Test",
};

test("OPTIONS vanaf toegestane origin geeft CORS terug", async () => {
  mockFetch();
  const res = await worker.fetch(new Request("https://worker.example/", { method: "OPTIONS", headers: { Origin: ORIGIN } }), env);
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), ORIGIN);
});

test("POST vanaf niet-toegestane origin wordt geweigerd", async () => {
  const calls = mockFetch();
  const res = await worker.fetch(formRequest(validFields, { origin: "https://kwaadaardig.example" }), env);
  assert.equal(res.status, 403);
  assert.equal(calls.siteverify, 0);
  assert.equal(calls.forward, 0);
});

test("GET wordt niet ondersteund", async () => {
  mockFetch();
  const res = await worker.fetch(new Request("https://worker.example/", { method: "GET", headers: { Origin: ORIGIN } }), env);
  assert.equal(res.status, 405);
});

test("honeypot ingevuld: stil 'succes', geen verificatie of bezorging", async () => {
  const calls = mockFetch();
  const res = await worker.fetch(formRequest({ ...validFields, _honey: "ik ben een bot" }), env);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(calls.siteverify, 0);
  assert.equal(calls.forward, 0);
});

test("ontbrekende token wordt geweigerd", async () => {
  const calls = mockFetch();
  const { ["cf-turnstile-response"]: _drop, ...noToken } = validFields;
  const res = await worker.fetch(formRequest(noToken), env);
  assert.equal(res.status, 400);
  assert.equal(await res.json().then((b) => b.success), false);
  assert.equal(calls.forward, 0);
});

test("ongeldige velden worden server-side geweigerd", async () => {
  const calls = mockFetch();
  const res = await worker.fetch(formRequest({ ...validFields, email: "geen-email" }), env);
  assert.equal(res.status, 422);
  assert.equal(calls.siteverify, 0);
  assert.equal(calls.forward, 0);
});

test("ontbrekende privacytoestemming wordt geweigerd", async () => {
  mockFetch();
  const { privacy: _p, ...noPrivacy } = validFields;
  const res = await worker.fetch(formRequest(noPrivacy), env);
  assert.equal(res.status, 422);
});

test("mislukte Turnstile-verificatie wordt geweigerd, geen bezorging", async () => {
  const calls = mockFetch({ siteverify: { success: false, "error-codes": ["timeout-or-duplicate"] } });
  const res = await worker.fetch(formRequest(validFields), env);
  assert.equal(res.status, 403);
  assert.equal(calls.forward, 0);
});

test("verkeerde hostname wordt geweigerd", async () => {
  const calls = mockFetch({ siteverify: { success: true, hostname: "phishing.example", action: "contact" } });
  const res = await worker.fetch(formRequest(validFields), env);
  assert.equal(res.status, 403);
  assert.equal(calls.forward, 0);
});

test("verkeerde action wordt geweigerd", async () => {
  const calls = mockFetch({ siteverify: { success: true, hostname: "desterksteboomvanrendestede.be", action: "iets-anders" } });
  const res = await worker.fetch(formRequest(validFields), env);
  assert.equal(res.status, 403);
  assert.equal(calls.forward, 0);
});

test("geldige inzending: geverifieerd en bezorgd", async () => {
  const calls = mockFetch();
  const res = await worker.fetch(formRequest(validFields), env);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.equal(calls.siteverify, 1);
  assert.equal(calls.forward, 1);
});

test("bezorging mislukt: nette foutmelding, geen valse bevestiging", async () => {
  mockFetch({ forwardOk: false });
  const res = await worker.fetch(formRequest(validFields), env);
  assert.equal(res.status, 502);
  assert.equal(await res.json().then((b) => b.success), false);
});
