const { hasSupabaseConfig, sendJson, supabaseConfigInfo, supabaseRequest } = require("./_supabase");

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
  } catch (error) {
    sendJson(response, 502, { error: "Impossible de lire Supabase.", detail: `${configLabel()} | ${error.message}` });
  }
}

async function writeRemoteState(request, response) {
  if (!hasSupabaseConfig()) {
    sendJson(response, 503, { error: "Supabase n'est pas configuré." });
    return;
  }

  try {
    const body = await readBody(request);
    const incomingState = body.state;
    if (!incomingState || typeof incomingState !== "object") throw new Error("Etat invalide");
    const state = mergeStates(await readStoredState(), incomingState);

    await upsertState(state);
    sendJson(response, 200, { ok: true, state });
  } catch (error) {
    sendJson(response, 400, { error: "Impossible de sauvegarder l'état.", detail: `${configLabel()} | ${error.message}` });
  }
}

function configLabel() {
  const info = supabaseConfigInfo();
  return `host=${info.host}, key=${info.keyType}, len=${info.keyLength}, service=${info.hasServiceRole}, secret=${info.hasSecretKey}, json=${info.hasSecretKeysJson}`;
}

async function upsertState(state) {
  const updatedAt = new Date().toISOString();
  const objectResponse = await postStateValue(state, updatedAt);
  if (objectResponse.ok) return;

  const objectError = `Supabase ${objectResponse.status}: ${await objectResponse.text()}`;
  const textResponse = await postStateValue(JSON.stringify(state), updatedAt);
  if (textResponse.ok) return;

  throw new Error(`${objectError} / Texte: Supabase ${textResponse.status}: ${await textResponse.text()}`);
}

function postStateValue(value, updatedAt) {
  return supabaseRequest("/rest/v1/app_settings?on_conflict=key", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({
      key: "state",
      value,
      updated_at: updatedAt,
    }),
  });
}

function readBody(request) {
  if (request.body && typeof request.body === "object") return Promise.resolve(request.body);
  if (typeof request.body === "string") return Promise.resolve(JSON.parse(request.body || "{}"));
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 500000) {
        request.destroy();
        reject(new Error("Requête trop grande"));
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

async function readStoredState() {
  const apiResponse = await supabaseRequest("/rest/v1/app_settings?key=eq.state&select=value", {
    method: "GET",
  });
  if (!apiResponse.ok) throw new Error(`Supabase ${apiResponse.status}: ${await apiResponse.text()}`);
  const rows = await apiResponse.json();
  const value = rows[0]?.value;
  return parseStoredValue(value);
}

function parseStoredValue(value) {
  if (!value) return null;
  if (typeof value === "string") return JSON.parse(value);
  if (typeof value === "object") return value;
  return null;
}

function mergeStates(stored, incoming) {
  if (!stored || typeof stored !== "object") return incoming;
  const userMerge = mergeUsers(stored.users, incoming.users);
  return {
    ...stored,
    ...incoming,
    users: userMerge.users,
    matches: mergeMatches(stored.matches, incoming.matches, userMerge.aliases),
    seasonBonus: mergeSeasonBonus(stored.seasonBonus, incoming.seasonBonus, userMerge.aliases),
  };
}

function mergeUsers(storedUsers = [], incomingUsers = []) {
  const usersById = new Map();
  const idByName = new Map();
  const aliases = {};
  [...storedUsers, ...incomingUsers].forEach((user) => {
    if (!user?.id) return;
    const nameKey = normalizeName(user.name);
    const canonicalId = nameKey ? idByName.get(nameKey) : null;
    if (canonicalId) {
      aliases[user.id] = canonicalId;
      usersById.set(canonicalId, { ...(usersById.get(canonicalId) || {}), ...user, id: canonicalId });
      return;
    }
    if (nameKey) idByName.set(nameKey, user.id);
    usersById.set(user.id, { ...(usersById.get(user.id) || {}), ...user });
  });
  return { users: [...usersById.values()], aliases };
}

function mergeMatches(storedMatches = [], incomingMatches = [], aliases = {}) {
  const matches = new Map();
  [...storedMatches, ...incomingMatches].forEach((match) => {
    const key = match?.externalId || match?.id;
    if (!key) return;
    const previous = matches.get(key) || {};
    matches.set(key, {
      ...previous,
      ...match,
      predictions: mergePredictions(previous.predictions, match.predictions, aliases),
    });
  });
  return [...matches.values()];
}

function mergePredictions(previousPredictions = {}, nextPredictions = {}, aliases = {}) {
  const predictions = {};
  [previousPredictions, nextPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, prediction]) => {
      addPrediction(predictions, userId, prediction, aliases);
    });
  });
  return predictions;
}

function addPrediction(predictions, userId, prediction, aliases = {}) {
    const canonicalId = aliases[userId] || userId;
    const previous = predictions[canonicalId] || predictions[userId] || {};
    predictions[canonicalId] = {
      ...previous,
      ...prediction,
      a: prediction?.a !== "" && prediction?.a !== undefined ? prediction.a : previous.a ?? "",
      b: prediction?.b !== "" && prediction?.b !== undefined ? prediction.b : previous.b ?? "",
    };
    if (canonicalId !== userId) delete predictions[userId];
}

function mergeSeasonBonus(storedBonus = {}, incomingBonus = {}, aliases = {}) {
  return {
    official: {
      ...(storedBonus.official || {}),
      ...(incomingBonus.official || {}),
    },
    predictions: mergeBonusPredictions(storedBonus.predictions, incomingBonus.predictions, aliases),
  };
}

function mergeBonusPredictions(storedPredictions = {}, incomingPredictions = {}, aliases = {}) {
  const predictions = {};
  [storedPredictions, incomingPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, bonus]) => {
      const canonicalId = aliases[userId] || userId;
      predictions[canonicalId] = { ...(predictions[canonicalId] || {}), ...bonus };
    });
  });
  return predictions;
}

function normalizeName(name = "") {
  return String(name).trim().toLocaleLowerCase("fr");
}
