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
  const urls = [
    apiUrlFor(competition, { season, stage }),
    apiUrlFor(competition, { season }),
  ];

  try {
    const result = await firstOfficialMatch(urls, token, stage);

    if (!result.ok) {
      sendJson(response, result.status, result.payload);
      return;
    }

    sendJson(response, 200, { match: result.match });
  } catch {
    sendJson(response, 502, { error: "Impossible de contacter football-data.org." });
  }
};

function apiUrlFor(competition, params) {
  return `https://api.football-data.org/v4/competitions/${encodeURIComponent(competition)}/matches?${new URLSearchParams(params)}`;
}

async function firstOfficialMatch(urls, token, stage) {
  let lastStatus = 404;
  let lastPayload = { error: "Aucun résultat officiel trouvé pour ce test." };

  for (const url of urls) {
    const apiResponse = await fetch(url, { headers: { "X-Auth-Token": token } });
    const payload = await apiResponse.json();
    if (!apiResponse.ok) {
      lastStatus = apiResponse.status;
      lastPayload = payload;
      continue;
    }

    const matches = payload.matches || [];
    const match = matches.find((candidate) => isOfficialMatch(candidate) && (!stage || candidate.stage === stage)) ||
      matches.find(isOfficialMatch);
    if (match) return { ok: true, match };
  }

  return { ok: false, status: lastStatus, payload: lastPayload };
}

function isOfficialMatch(match) {
  const fullTime = match.score?.fullTime ?? {};
  return Number.isInteger(fullTime.home) && Number.isInteger(fullTime.away);
}
