const { sendJson } = require("./_supabase");

module.exports = async function handler(request, response) {
  const token = process.env.FOOTBALL_DATA_API_KEY || request.headers["x-auth-token"];
  if (!token) {
    sendJson(response, 401, { error: "Clé API manquante." });
    return;
  }

  const season = request.query?.season || "2026";

  try {
    const teamsResponse = await fetch(`https://api.football-data.org/v4/competitions/PL/teams?season=${encodeURIComponent(season)}`, {
      headers: { "X-Auth-Token": token },
    });
    const teamsPayload = await teamsResponse.json();
    if (!teamsResponse.ok) {
      sendJson(response, teamsResponse.status, teamsPayload);
      return;
    }

    const teams = teamsPayload.teams || [];
    const details = await Promise.all(teams.map((team) => fetchTeamSquad(team, token)));
    const playersByTeam = {};
    details.forEach(({ name, players }) => {
      if (name) playersByTeam[name] = players;
    });

    sendJson(response, 200, { playersByTeam });
  } catch {
    sendJson(response, 502, { error: "Impossible de contacter football-data.org." });
  }
};

async function fetchTeamSquad(team, token) {
  const name = team.shortName || team.name;
  try {
    const response = await fetch(`https://api.football-data.org/v4/teams/${team.id}`, {
      headers: { "X-Auth-Token": token },
    });
    const payload = await response.json();
    const players = (payload.squad || [])
      .map((player) => player.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "fr"));
    return { name, players };
  } catch {
    return { name, players: [] };
  }
}
