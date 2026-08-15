const { hasSupabaseConfig, sendJson, supabaseConfigInfo, supabaseRequest } = require("./_supabase");

const seasonYear = "2026";

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");

  if (request.method !== "GET" && request.method !== "POST") {
    sendJson(response, 405, { error: "Méthode non autorisée." });
    return;
  }

  if (!hasSupabaseConfig()) {
    sendJson(response, 503, { error: "Supabase n'est pas configuré.", detail: configLabel() });
    return;
  }

  const token = process.env.FOOTBALL_DATA_API_KEY;
  if (!token) {
    sendJson(response, 401, { error: "Clé football-data manquante." });
    return;
  }

  try {
    const state = (await readStoredState()) || defaultState();
    const apiMatches = await fetchPremierLeagueMatches(token);
    const result = syncMatchesIntoState(state, apiMatches);

    if (result.changed) await upsertState(state);

    sendJson(response, 200, {
      ok: true,
      checked: apiMatches.length,
      updated: result.updated,
      added: result.added,
      changed: result.changed,
      finished: state.matches.filter((match) => match.status === "FINISHED").length,
    });
  } catch (error) {
    sendJson(response, 502, { error: "Synchronisation automatique impossible.", detail: `${configLabel()} | ${error.message}` });
  }
};

async function fetchPremierLeagueMatches(token) {
  const apiUrl = `https://api.football-data.org/v4/competitions/PL/matches?season=${encodeURIComponent(seasonYear)}`;
  const apiResponse = await fetch(apiUrl, { headers: { "X-Auth-Token": token } });
  if (!apiResponse.ok) throw new Error(`football-data ${apiResponse.status}: ${await apiResponse.text()}`);
  const data = await apiResponse.json();
  if (!Array.isArray(data.matches)) throw new Error("Réponse football-data invalide");
  return data.matches;
}

function syncMatchesIntoState(state, apiMatches) {
  state.matches = Array.isArray(state.matches) ? state.matches.filter((match) => match.status !== "TEST") : [];
  state.testMode = false;

  const byKey = new Map();
  state.matches.forEach((match) => {
    if (match?.externalId) byKey.set(String(match.externalId), match);
    if (match?.id) byKey.set(String(match.id), match);
  });

  let updated = 0;
  let added = 0;

  apiMatches.forEach((apiMatch) => {
    const next = fromApiMatch(apiMatch);
    const existing = byKey.get(next.externalId) || byKey.get(next.id);

    if (!existing) {
      state.matches.push(next);
      byKey.set(next.externalId, next);
      byKey.set(next.id, next);
      added += 1;
      return;
    }

    const before = JSON.stringify({
      teamA: existing.teamA,
      teamB: existing.teamB,
      date: existing.date,
      matchday: existing.matchday,
      status: existing.status,
      result: existing.result,
    });

    existing.externalId = next.externalId;
    existing.teamA = next.teamA;
    existing.teamB = next.teamB;
    existing.date = next.date;
    existing.matchday = next.matchday;
    existing.status = next.status;
    existing.result = next.result;
    existing.predictions = existing.predictions || {};

    const after = JSON.stringify({
      teamA: existing.teamA,
      teamB: existing.teamB,
      date: existing.date,
      matchday: existing.matchday,
      status: existing.status,
      result: existing.result,
    });
    if (before !== after) updated += 1;
  });

  state.lastSync = new Date().toISOString();
  return { updated, added, changed: updated > 0 || added > 0 };
}

function fromApiMatch(match) {
  const fullTime = match.score?.fullTime ?? {};
  const hasFullTime = Number.isInteger(fullTime.home) && Number.isInteger(fullTime.away);
  return {
    id: `fd-${match.id}`,
    externalId: String(match.id),
    teamA: match.homeTeam?.shortName || match.homeTeam?.name || "Domicile",
    teamB: match.awayTeam?.shortName || match.awayTeam?.name || "Extérieur",
    date: match.utcDate ? toInputDate(new Date(match.utcDate)) : "",
    matchday: match.matchday ?? null,
    status: match.status ?? "SCHEDULED",
    result: {
      a: hasFullTime ? String(fullTime.home) : "",
      b: hasFullTime ? String(fullTime.away) : "",
    },
    predictions: {},
  };
}

function toInputDate(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

async function readStoredState() {
  const apiResponse = await supabaseRequest("/rest/v1/app_settings?key=eq.state&select=value", {
    method: "GET",
  });
  if (!apiResponse.ok) throw new Error(`Supabase ${apiResponse.status}: ${await apiResponse.text()}`);
  const rows = await apiResponse.json();
  return parseStoredValue(rows[0]?.value);
}

function parseStoredValue(value) {
  if (!value) return null;
  if (typeof value === "string") return JSON.parse(value);
  if (typeof value === "object") return value;
  return null;
}

async function upsertState(state) {
  const response = await supabaseRequest("/rest/v1/app_settings?on_conflict=key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({
      key: "state",
      value: state,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
}

function defaultState() {
  return {
    users: [],
    matches: [],
    playersByTeam: {},
    seasonBonus: { official: {}, predictions: {} },
    deletedUsers: { ids: {}, names: {} },
    matchdayFilter: "all",
    lastSync: null,
    testMode: false,
  };
}

function configLabel() {
  const info = supabaseConfigInfo();
  return `host=${info.host}, key=${info.keyType}, len=${info.keyLength}, service=${info.hasServiceRole}, secret=${info.hasSecretKey}, json=${info.hasSecretKeysJson}`;
}
