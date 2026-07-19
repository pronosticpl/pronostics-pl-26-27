const { sendJson } = require("./_supabase");
const fixedPlayersByTeam = require("./player-list");

module.exports = async function handler(request, response) {
  const token = process.env.FOOTBALL_DATA_API_KEY || request.headers["x-auth-token"];
  const season = request.query?.season || "2026";

  try {
    const playersByTeam = {};
    await mergePlayers(playersByTeam, Promise.resolve(fixedPlayersByTeam));
    await mergePlayers(playersByTeam, fetchFantasyPremierLeaguePlayers());
    if (token) await mergePlayers(playersByTeam, fetchFootballDataPlayers(token, season));
    sortPlayers(playersByTeam);

    sendJson(response, 200, { playersByTeam });
  } catch {
    sendJson(response, 502, { error: "Impossible de charger la liste officielle des joueurs." });
  }
};

async function fetchFantasyPremierLeaguePlayers() {
  const apiResponse = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/", {
    headers: { "User-Agent": "NovaProno/1.0" },
  });
  const payload = await apiResponse.json();
  if (!apiResponse.ok) throw new Error("Premier League indisponible");

  const teamsById = new Map((payload.teams || []).map((team) => [team.id, team]));
  const playersByTeam = {};
  (payload.elements || []).forEach((player) => {
    const team = teamsById.get(player.team);
    const playerName = [player.first_name, player.second_name].filter(Boolean).join(" ").trim() || player.web_name;
    if (!team || !playerName) return;
    addPlayers(playersByTeam, expandTeamNames([team.name, team.short_name]), [playerName]);
  });
  return playersByTeam;
}

async function fetchFootballDataPlayers(token, season) {
  const teamsResponse = await fetch(`https://api.football-data.org/v4/competitions/PL/teams?season=${encodeURIComponent(season)}`, {
    headers: { "X-Auth-Token": token },
  });
  const teamsPayload = await teamsResponse.json();
  if (!teamsResponse.ok) return {};

  const teams = teamsPayload.teams || [];
  const details = await Promise.all(teams.map((team) => fetchTeamSquad(team, token)));
  const playersByTeam = {};
  details.forEach(({ names, players }) => {
    addPlayers(playersByTeam, expandTeamNames(names), players);
  });
  return playersByTeam;
}

async function mergePlayers(target, sourcePromise) {
  try {
    const source = await sourcePromise;
    Object.entries(source || {}).forEach(([team, players]) => addPlayers(target, [team], players));
  } catch {
    // Keep the import usable even if one official source is temporarily unavailable.
  }
}

async function fetchTeamSquad(team, token) {
  const names = [...new Set([team.shortName, team.name, team.tla].filter(Boolean))];
  const directPlayers = playersFromSquad(team.squad);
  if (directPlayers.length) return { names, players: directPlayers };

  try {
    const response = await fetch(`https://api.football-data.org/v4/teams/${team.id}`, {
      headers: { "X-Auth-Token": token },
    });
    const payload = await response.json();
    return { names, players: playersFromSquad(payload.squad) };
  } catch {
    return { names, players: [] };
  }
}

function playersFromSquad(squad = []) {
  return (Array.isArray(squad) ? squad : [])
    .map((player) => player.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "fr"));
}

function addPlayers(playersByTeam, teams, players) {
  teams.filter(Boolean).forEach((team) => {
    playersByTeam[team] = [...new Set([...(playersByTeam[team] || []), ...(players || []).filter(Boolean)])];
  });
}

function sortPlayers(playersByTeam) {
  Object.keys(playersByTeam).forEach((team) => {
    playersByTeam[team] = playersByTeam[team].sort((a, b) => a.localeCompare(b, "fr"));
  });
}

function expandTeamNames(names = []) {
  const aliases = {
    Arsenal: ["Arsenal FC"],
    "Arsenal FC": ["Arsenal"],
    Bournemouth: ["AFC Bournemouth"],
    "AFC Bournemouth": ["Bournemouth"],
    Brighton: ["Brighton & Hove Albion", "Brighton and Hove Albion", "Brighton Hove"],
    "Brighton Hove": ["Brighton", "Brighton & Hove Albion", "Brighton and Hove Albion"],
    "Brighton & Hove Albion": ["Brighton"],
    "Brighton and Hove Albion": ["Brighton", "Brighton Hove", "Brighton & Hove Albion"],
    Ipswich: ["Ipswich Town"],
    "Ipswich Town": ["Ipswich"],
    Leeds: ["Leeds United"],
    "Leeds United": ["Leeds"],
    Liverpool: ["Liverpool FC"],
    "Liverpool FC": ["Liverpool"],
    "Man City": ["Manchester City"],
    "Manchester City": ["Man City"],
    "Man United": ["Manchester United"],
    "Manchester United": ["Man United"],
    Newcastle: ["Newcastle United"],
    "Newcastle United": ["Newcastle"],
    Nottingham: ["Nottingham Forest"],
    "Nottingham Forest": ["Nottingham"],
    Tottenham: ["Tottenham Hotspur"],
    "Tottenham Hotspur": ["Tottenham"],
  };

  const expanded = new Set();
  names.forEach((name) => {
    if (!name) return;
    expanded.add(name);
    if (aliases[name]) aliases[name].forEach((alias) => expanded.add(alias));
    expanded.add(name.replace(/\s+FC$/i, "").replace(/^AFC\s+/i, "").trim());
  });
  return [...expanded].filter(Boolean);
}
