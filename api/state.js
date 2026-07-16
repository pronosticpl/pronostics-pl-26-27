const { hasSupabaseConfig, sendJson, supabaseRequest } = require("./_supabase");

module.exports = async function handler(request, response) {
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
    const apiResponse = await supabaseRequest("/rest/v1/app_settings?key=eq.state&select=value", {
      method: "GET",
    });
    const rows = await apiResponse.json();
    const value = rows[0]?.value;
    sendJson(response, 200, { state: value ? JSON.parse(value) : null });
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
    const state = request.body?.state;
    if (!state || typeof state !== "object") throw new Error("Etat invalide");

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
    sendJson(response, 200, { ok: true });
  } catch {
    sendJson(response, 400, { error: "Impossible de sauvegarder l'état." });
  }
}
