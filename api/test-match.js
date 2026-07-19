const { sendJson } = require("./_supabase");

module.exports = async function handler(request, response) {
  const token = process.env.FOOTBALL_DATA_API_KEY || request.headers["x-auth-token"];
  if (!token) {
    sendJson(response, 401, { error: "Clé API manquante." });
    return;
  }

  const competition = request.query?.competition || "WC";
  const season = request.query?.season || "2022";
  const stage = request.query?.stage || "FINAL";
  const params = new URLSearchParams({ season, stage });
  const apiUrl = `https://api.football-data.org/v4/competitions/${encodeURIComponent(competition)}/matches?${params}`;

  try {
    const apiResponse = await fetch(apiUrl, { headers: { "X-Auth-Token": token } });
    const payload = await apiResponse.json();
    if (!apiResponse.ok) {
      sendJson(response, apiResponse.status, payload);
      return;
    }

    const match = (payload.matches || []).find((candidate) => {
      const fullTime = candidate.score?.fullTime ?? {};
      return Number.isInteger(fullTime.home) && Number.isInteger(fullTime.away);
    });

    if (!match) {
      sendJson(response, 404, { error: "Aucun résultat officiel trouvé pour ce test." });
      return;
    }

    sendJson(response, 200, { match });
  } catch {
    sendJson(response, 502, { error: "Impossible de contacter football-data.org." });
  }
};
