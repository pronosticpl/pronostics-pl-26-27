const { sendJson } = require("./_supabase");

module.exports = async function handler(request, response) {
  const token = process.env.FOOTBALL_DATA_API_KEY || request.headers["x-auth-token"];
  if (!token) {
    sendJson(response, 401, { error: "Clé API manquante." });
    return;
  }

  const season = request.query?.season || "2026";
  const apiUrl = `https://api.football-data.org/v4/competitions/PL/matches?season=${encodeURIComponent(season)}`;

  try {
    const apiResponse = await fetch(apiUrl, { headers: { "X-Auth-Token": token } });
    const text = await apiResponse.text();
    response
      .status(apiResponse.status)
      .setHeader("content-type", apiResponse.headers.get("content-type") || "application/json; charset=utf-8")
      .setHeader("cache-control", "no-store")
      .send(text);
  } catch {
    sendJson(response, 502, { error: "Impossible de contacter football-data.org." });
  }
};
