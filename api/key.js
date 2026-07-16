const { sendJson } = require("./_supabase");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Méthode non autorisée." });
    return;
  }

  if (process.env.FOOTBALL_DATA_API_KEY) {
    sendJson(response, 200, { ok: true, source: "environment" });
    return;
  }

  sendJson(response, 400, {
    error: "Sur Vercel, ajoute FOOTBALL_DATA_API_KEY dans Environment Variables.",
  });
};
