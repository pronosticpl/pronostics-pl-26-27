const { hasSupabaseConfig, sendJson, supabaseRequest } = require("./_supabase");

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");

  if (request.method === "GET") {
    await readRemoteState(response);
    return;
  }

  if (request.method === "PUT") {
    await writeRemoteState(request, response);
    return;
  }

  sendJson(response, 405, { error: "Méthode non autorisée." });
};

async function readRemoteState(response) {
  if (!hasSupabaseConfig()) {
    sendJson(response, 503, { error: "Supabase n'est pas configuré." });
    return;
  }

  try {
    sendJson(response, 200, { state: await readStoredState() });
  } catch {
    sendJson(response, 502, { error: "Impossible de lire Supabase." });
  }
}

async function writeRemoteState(request, response) {
  if (!hasSupabaseConfig()) {
    sendJson(response, 503, { error: "Supabase n'est pas configuré." });
    return;
  }

  try {
    const incomingState = request.body?.state;
    if (!incomingState || typeof incomingState !== "object") throw new Error("Etat invalide");
    const state = mergeStates(await readStoredState(), incomingState);

    const apiResponse = await supabaseRequest("/rest/v1/app_settings?on_conflict=key", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        key: "state",
        value: JSON.stringify(state),
        updated_at: new Date().toISOString(),
      }),
    });

    if (!apiResponse.ok) throw new Error(`Supabase ${apiResponse.status}`);
    sendJson(response, 200, { ok: true, state });
  } catch {
    sendJson(response, 400, { error: "Impossible de sauvegarder l'état." });
  }
}

async function readStoredState() {
  const apiResponse = await supabaseRequest("/rest/v1/app_settings?key=eq.state&select=value", {
    method: "GET",
  });
  const rows = await apiResponse.json();
  const value = rows[0]?.value;
  return value ? JSON.parse(value) : null;
}

function mergeStates(stored, incoming) {
  if (!stored || typeof stored !== "object") return incoming;
  return {
    ...stored,
    ...incoming,
    users: mergeUsers(stored.users, incoming.users),
    matches: mergeMatches(stored.matches, incoming.matches),
    seasonBonus: mergeSeasonBonus(stored.seasonBonus, incoming.seasonBonus),
  };
}

function mergeUsers(storedUsers = [], incomingUsers = []) {
  const users = new Map();
  [...storedUsers, ...incomingUsers].forEach((user) => {
    if (!user?.id) return;
    users.set(user.id, { ...(users.get(user.id) || {}), ...user });
  });
  return [...users.values()];
}

function mergeMatches(storedMatches = [], incomingMatches = []) {
  const matches = new Map();
  [...storedMatches, ...incomingMatches].forEach((match) => {
    const key = match?.externalId || match?.id;
    if (!key) return;
    const previous = matches.get(key) || {};
    matches.set(key, {
      ...previous,
      ...match,
      predictions: {
        ...(previous.predictions || {}),
        ...(match.predictions || {}),
      },
    });
  });
  return [...matches.values()];
}

function mergeSeasonBonus(storedBonus = {}, incomingBonus = {}) {
  return {
    official: {
      ...(storedBonus.official || {}),
      ...(incomingBonus.official || {}),
    },
    predictions: {
      ...(storedBonus.predictions || {}),
      ...(incomingBonus.predictions || {}),
    },
  };
}
