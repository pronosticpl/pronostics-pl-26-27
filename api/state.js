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
      if (body.length > 2000000) {
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
  const deletedUsers = mergeDeletedUsers(stored.deletedUsers, incoming.deletedUsers);
  const userMerge = mergeUsers(stored.users, incoming.users, deletedUsers);
  return {
    ...stored,
    ...incoming,
    deletedUsers,
    users: userMerge.users,
    matches: mergeMatches(stored.matches, incoming.matches, userMerge.aliases, deletedUsers),
    seasonBonus: mergeSeasonBonus(stored.seasonBonus, incoming.seasonBonus, userMerge.aliases, deletedUsers),
  };
}

function mergeUsers(storedUsers = [], incomingUsers = [], deletedUsers = {}) {
  const usersById = new Map();
  const idByName = new Map();
  const aliases = {};
  [...storedUsers, ...incomingUsers].forEach((user) => {
    if (!user?.id) return;
    const nameKey = normalizeName(user.name);
    if (isDeletedUser(user, deletedUsers)) {
      aliases[user.id] = null;
      return;
    }
    const canonicalId = nameKey ? idByName.get(nameKey) : null;
    if (canonicalId) {
      aliases[user.id] = canonicalId;
      usersById.set(canonicalId, mergeUser(usersById.get(canonicalId), { ...user, id: canonicalId }));
      return;
    }
    if (nameKey) idByName.set(nameKey, user.id);
    usersById.set(user.id, mergeUser(usersById.get(user.id), user));
  });
  return { users: [...usersById.values()], aliases };
}

function mergeUser(previous = {}, next = {}) {
  const merged = { ...previous, ...next };
  const previousPinAt = Number(previous.pinUpdatedAt || previous.createdAt) || 0;
  const nextPinAt = Number(next.pinUpdatedAt || next.createdAt) || 0;
  if (previous.pin && previousPinAt > nextPinAt) {
    merged.pin = previous.pin;
    merged.pinUpdatedAt = previous.pinUpdatedAt || previous.createdAt;
  } else if (next.pin) {
    merged.pin = next.pin;
    merged.pinUpdatedAt = next.pinUpdatedAt || next.createdAt || Date.now();
  }
  return merged;
}

function mergeMatches(storedMatches = [], incomingMatches = [], aliases = {}, deletedUsers = {}) {
  const matches = new Map();
  [...storedMatches, ...incomingMatches].forEach((match) => {
    const key = match?.externalId || match?.id;
    if (!key) return;
    const previous = matches.get(key) || {};
    matches.set(key, {
      ...previous,
      ...match,
      predictions: mergePredictions(previous.predictions, match.predictions, aliases, deletedUsers),
    });
  });
  return [...matches.values()];
}

function mergePredictions(previousPredictions = {}, nextPredictions = {}, aliases = {}, deletedUsers = {}) {
  const predictions = {};
  [previousPredictions, nextPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, prediction]) => {
      addPrediction(predictions, userId, prediction, aliases, deletedUsers);
    });
  });
  return predictions;
}

function addPrediction(predictions, userId, prediction, aliases = {}, deletedUsers = {}) {
    if (aliases[userId] === null || deletedUsers?.ids?.[userId]) return;
    const canonicalId = aliases[userId] || userId;
    if (deletedUsers?.ids?.[canonicalId]) return;
    const previous = predictions[canonicalId] || predictions[userId] || {};
    predictions[canonicalId] = {
      ...previous,
      ...prediction,
      a: newestPredictionValue(previous, prediction, "a"),
      b: newestPredictionValue(previous, prediction, "b"),
      aUpdatedAt: Math.max(Number(previous.aUpdatedAt) || 0, Number(prediction?.aUpdatedAt) || 0),
      bUpdatedAt: Math.max(Number(previous.bUpdatedAt) || 0, Number(prediction?.bUpdatedAt) || 0),
    };
    if (canonicalId !== userId) delete predictions[userId];
}

function newestPredictionValue(previous = {}, prediction = {}, side) {
  const nextValue = prediction?.[side];
  if (nextValue === "" || nextValue === undefined) return previous[side] ?? "";
  const previousValue = previous?.[side];
  if (previousValue === "" || previousValue === undefined) return nextValue;
  const previousTime = Number(previous?.[`${side}UpdatedAt`]) || 0;
  const nextTime = Number(prediction?.[`${side}UpdatedAt`]) || 0;
  if (!previousTime && !nextTime) return previousValue;
  return nextTime >= previousTime ? nextValue : previousValue;
}

function mergeSeasonBonus(storedBonus = {}, incomingBonus = {}, aliases = {}, deletedUsers = {}) {
  return {
    official: {
      ...(storedBonus.official || {}),
      ...(incomingBonus.official || {}),
    },
    predictions: mergeBonusPredictions(storedBonus.predictions, incomingBonus.predictions, aliases, deletedUsers),
  };
}

function mergeBonusPredictions(storedPredictions = {}, incomingPredictions = {}, aliases = {}, deletedUsers = {}) {
  const predictions = {};
  [storedPredictions, incomingPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, bonus]) => {
      if (aliases[userId] === null || deletedUsers?.ids?.[userId]) return;
      const canonicalId = aliases[userId] || userId;
      if (deletedUsers?.ids?.[canonicalId]) return;
      predictions[canonicalId] = { ...(predictions[canonicalId] || {}), ...bonus };
    });
  });
  return predictions;
}

function mergeDeletedUsers(storedDeleted = {}, incomingDeleted = {}) {
  const stored = normalizeDeletedUsers(storedDeleted);
  const incoming = normalizeDeletedUsers(incomingDeleted);
  return {
    ids: mergeTimestampMaps(stored.ids, incoming.ids),
    names: mergeTimestampMaps(stored.names, incoming.names),
  };
}

function normalizeDeletedUsers(deletedUsers = {}) {
  return {
    ids: { ...(deletedUsers.ids || {}) },
    names: { ...(deletedUsers.names || {}) },
  };
}

function mergeTimestampMaps(a = {}, b = {}) {
  const result = { ...a };
  Object.entries(b).forEach(([key, value]) => {
    result[key] = Math.max(Number(result[key]) || 0, Number(value) || 0);
  });
  return result;
}

function isDeletedUser(user, deletedUsers = {}) {
  const deletedByNameAt = Number(deletedUsers.names?.[normalizeName(user.name)]) || 0;
  const createdAt = Number(user.createdAt) || 0;
  return Boolean(deletedUsers.ids?.[user.id] || (deletedByNameAt && (!createdAt || createdAt <= deletedByNameAt)));
}

function normalizeName(name = "") {
  return String(name).trim().toLocaleLowerCase("fr");
}
