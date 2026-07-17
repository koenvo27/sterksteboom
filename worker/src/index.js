/**
 * Contactformulier-Worker voor De Sterkste Boom van Rendestede.
 *
 * Doel: het contactformulier post NIET meer rechtstreeks naar FormSubmit, maar
 * naar deze Worker. De Worker verifieert de Cloudflare Turnstile-token
 * server-side (Siteverify), valideert de velden, en stuurt de inzending pas
 * daarna door. Zo is de captcha verplicht en niet te omzeilen door de frontend
 * over te slaan.
 *
 * Geheimen: TURNSTILE_SECRET_KEY staat UITSLUITEND als Worker-secret
 * (`wrangler secret put TURNSTILE_SECRET_KEY`), nooit in de repo of client.
 *
 * Configuratie via [vars] in wrangler.toml:
 *   ALLOWED_ORIGINS      Komma-lijst van toegestane origins (CORS).
 *   TURNSTILE_HOSTNAMES  Komma-lijst van geldige Turnstile-hostnames.
 *   TURNSTILE_ACTION     Verwachte Turnstile 'action' (bv. "contact").
 *   FORM_FORWARD_URL     Bezorgings-endpoint (FormSubmit AJAX-URL).
 * Optionele binding:
 *   RATE_LIMIT           KV-namespace voor duurzame rate limiting.
 */

const DEFAULT_ORIGINS = [
  "https://desterksteboomvanrendestede.be",
  "https://www.desterksteboomvanrendestede.be",
];

// Maximale veldlengtes (server-side afgedwongen, los van de client).
const LIMITS = { name: 100, email: 150, category: 100, subject: 150, message: 5000 };

// Eenvoudige best-effort rate limiting binnen één isolate (fallback wanneer er
// geen KV-binding is). Voor duurzame limiting: koppel een KV-namespace 'RATE_LIMIT'.
const RL_WINDOW_MS = 60_000;
const RL_MAX = 5;
const memoryHits = new Map();

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = list(env.ALLOWED_ORIGINS, DEFAULT_ORIGINS);
    const originOk = allowedOrigins.includes(origin);
    const cors = corsHeaders(origin, originOk);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: originOk ? 204 : 403, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ success: false, message: "Deze aanvraag wordt niet ondersteund." }, 405, cors);
    }
    // Cross-origin misbruik weren: enkel onze eigen site mag posten.
    if (!originOk) {
      return json({ success: false, message: "Deze aanvraag is niet toegestaan." }, 403, cors);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "";
    if (!(await rateLimitOk(env, ip))) {
      return json(
        { success: false, message: "Je hebt te veel berichten na elkaar verstuurd. Probeer het over enkele minuten opnieuw." },
        429,
        cors,
      );
    }

    // Body inlezen (form-data of JSON).
    let field;
    try {
      field = await readBody(request);
    } catch {
      return json({ success: false, message: "We konden je bericht niet lezen. Probeer het opnieuw." }, 400, cors);
    }

    // Honeypot: als dit verborgen veld ingevuld is, is het (bijna zeker) een bot.
    // We geven bewust een 'succes' terug zodat bots geen signaal krijgen.
    if (str(field("_honey")).length > 0) {
      return json({ success: true, message: "Bedankt voor je bericht." }, 200, cors);
    }

    // Velden ophalen + server-side valideren.
    const name = str(field("name"));
    const email = str(field("email"));
    const category = str(field("category"));
    const message = str(field("message"));
    const subject = str(field("_subject")) || category || "Bericht via de website";
    const privacy = field("privacy");

    if (
      name.length < 2 || name.length > LIMITS.name ||
      !isEmail(email) || email.length > LIMITS.email ||
      message.length < 2 || message.length > LIMITS.message ||
      category.length > LIMITS.category ||
      subject.length > LIMITS.subject ||
      !isChecked(privacy)
    ) {
      return json(
        { success: false, message: "Controleer je gegevens: vul je naam, een geldig e-mailadres, een bericht in en geef je akkoord." },
        422,
        cors,
      );
    }

    // Turnstile-token: aanwezig?
    const token = str(field("cf-turnstile-response"));
    if (!token) {
      return json({ success: false, message: "De beveiligingscontrole ontbreekt. Vernieuw de pagina en probeer opnieuw." }, 400, cors);
    }

    // Turnstile server-side verifiëren. Siteverify weigert zelf lege, verlopen
    // en al gebruikte tokens (error-code 'timeout-or-duplicate').
    const verify = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip);
    if (!verify || verify.success !== true) {
      return json(
        { success: false, message: "De beveiligingscontrole is verlopen of ongeldig. Vernieuw de pagina en probeer opnieuw." },
        403,
        cors,
      );
    }
    // Hostname- en action-controle: token moet van onze site en van dit formulier komen.
    const validHosts = list(env.TURNSTILE_HOSTNAMES, DEFAULT_ORIGINS.map(hostOf));
    if (verify.hostname && validHosts.length && !validHosts.includes(verify.hostname)) {
      return json({ success: false, message: "De beveiligingscontrole hoort niet bij deze website." }, 403, cors);
    }
    const expectedAction = (env.TURNSTILE_ACTION || "").trim();
    if (expectedAction && verify.action && verify.action !== expectedAction) {
      return json({ success: false, message: "De beveiligingscontrole is niet geldig." }, 403, cors);
    }

    // Alles in orde: pas nu bezorgen.
    const delivered = await forward(env, { name, email, subject, category, message });
    if (!delivered.ok) {
      return json(
        {
          success: false,
          message: "Je bericht kon nu niet verzonden worden. Probeer het later opnieuw of mail ons rechtstreeks.",
          // TIJDELIJK diagnostisch veld — verwijderen na de end-to-end test.
          debug: { status: delivered.status, detail: delivered.detail },
        },
        502,
        cors,
      );
    }
    return json({ success: true, message: "Bedankt, je bericht is goed verzonden." }, 200, cors);
  },
};

// ---------------------------------------------------------------------------

async function verifyTurnstile(token, secret, ip) {
  if (!secret) return null;
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Bezorging via de FormSubmit AJAX-endpoint (server-naar-server, geen redirect).
// Geeft { ok, status, detail } terug zodat de aanroeper kan diagnosticeren.
async function forward(env, data) {
  const url = (env.FORM_FORWARD_URL || "").trim();
  if (!url) return { ok: false, status: 0, detail: "no-forward-url" };
  const site = list(env.ALLOWED_ORIGINS, DEFAULT_ORIGINS)[0] || "https://desterksteboomvanrendestede.be";
  // FormSubmit verwacht de conventionele velden (name/email/message); 'email'
  // wordt als reply-to gebruikt. We sturen ook een Referer mee, want FormSubmit
  // weigert server-aanvragen zonder herkomst.
  const payload = {
    name: data.name,
    email: data.email,
    message: data.message,
    ...(data.category ? { onderwerp: data.category } : {}),
    _subject: data.subject,
    _template: "table",
    _captcha: "false",
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: site,
        Origin: site,
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text().catch(() => "");
    let ok = false;
    try {
      ok = String(JSON.parse(text).success) === "true";
    } catch {
      ok = false;
    }
    return { ok, status: res.status, detail: text.slice(0, 300) };
  } catch (e) {
    return { ok: false, status: 0, detail: "fetch-failed: " + ((e && e.message) || "onbekend") };
  }
}

async function rateLimitOk(env, ip) {
  if (!ip) return true;
  // Duurzaam via KV wanneer beschikbaar.
  if (env.RATE_LIMIT) {
    const key = `rl:${ip}`;
    const current = parseInt((await env.RATE_LIMIT.get(key)) || "0", 10);
    if (current >= RL_MAX) return false;
    await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: 60 });
    return true;
  }
  // Best-effort fallback binnen dit isolate.
  const now = Date.now();
  const hits = (memoryHits.get(ip) || []).filter((t) => now - t < RL_WINDOW_MS);
  if (hits.length >= RL_MAX) {
    memoryHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  memoryHits.set(ip, hits);
  return true;
}

async function readBody(request) {
  const ct = request.headers.get("Content-Type") || "";
  if (ct.includes("application/json")) {
    const obj = await request.json();
    return (k) => (obj && k in obj ? obj[k] : null);
  }
  // multipart/form-data of x-www-form-urlencoded
  const fd = await request.formData();
  return (k) => fd.get(k);
}

function corsHeaders(origin, allowed) {
  const h = {
    Vary: "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (allowed) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function json(obj, status, extraHeaders) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

function list(value, fallback) {
  if (!value) return fallback;
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(v) {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

function isEmail(v) {
  // Bewust eenvoudige, robuuste controle.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isChecked(v) {
  const s = str(v).toLowerCase();
  return v === true || s === "on" || s === "true" || s === "1" || s === "yes" || s === "ja";
}

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
