const storageKey = "novaprono-v2";
const sessionUserStorageKey = "novaprono-current-user";
const apiKeyStorageKey = "novaprono-football-data-key";
const testModeStorageKey = "novaprono-test-mode";
const accessStorageKey = "novaprono-access-ok";
const sitePassword = "YNWA";
const competitionCode = "PL";
const seasonYear = 2026;
const adminName = "Norbert";
const autoSyncEveryMs = 2 * 60 * 1000;
const seasonBonusCategories = [
  { id: "champion", label: "Champion", points: 10 },
  { id: "bestAttack", label: "Meilleure attaque", points: 5 },
  { id: "bestDefense", label: "Meilleure défense", points: 5 },
  { id: "topScorer", label: "Meilleur buteur", points: 3 },
  { id: "bestAssister", label: "Meilleur passeur", points: 3 },
  { id: "goldenGloves", label: "Meilleur gardien", points: 3 },
  { id: "bestPlayer", label: "Meilleur joueur", points: 3 },
];

const defaultState = {
  users: [],
  matches: [],
  seasonBonus: { official: {}, predictions: {} },
  deletedUsers: { ids: {}, names: {} },
  currentUserId: null,
  matchdayFilter: "all",
  lastSync: null,
  testMode: false,
};

let state = migrateState(loadState());
let autoSyncTimer = null;
let currentUserId = localStorage.getItem(sessionUserStorageKey);
let remoteSaveTimer = null;
let remoteRefreshTimer = null;
let lastLocalChangeAt = 0;
if (removeDemoMatches()) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

const els = {
  accessGate: document.querySelector("#accessGate"),
  accessForm: document.querySelector("#accessForm"),
  accessPassword: document.querySelector("#accessPassword"),
  accessError: document.querySelector("#accessError"),
  appShell: document.querySelector("#appShell"),
  signupForm: document.querySelector("#signupForm"),
  signupName: document.querySelector("#signupName"),
  signupPin: document.querySelector("#signupPin"),
  loginForm: document.querySelector("#loginForm"),
  loginUser: document.querySelector("#loginUser"),
  loginPin: document.querySelector("#loginPin"),
  logoutBtn: document.querySelector("#logoutBtn"),
  friendList: document.querySelector("#friendList"),
  friendCount: document.querySelector("#friendCount"),
  sessionLabel: document.querySelector("#sessionLabel"),
  refreshStateBtn: document.querySelector("#refreshStateBtn"),
  remoteStatus: document.querySelector("#remoteStatus"),
  matchForm: document.querySelector("#matchForm"),
  teamA: document.querySelector("#teamA"),
  teamB: document.querySelector("#teamB"),
  matchDate: document.querySelector("#matchDate"),
  matchday: document.querySelector("#matchday"),
  matchdayFilter: document.querySelector("#matchdayFilter"),
  matchList: document.querySelector("#matchList"),
  matchCount: document.querySelector("#matchCount"),
  leaderboard: document.querySelector("#leaderboard"),
  resetBtn: document.querySelector("#resetBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  importInput: document.querySelector("#importInput"),
  apiKey: document.querySelector("#apiKey"),
  saveKeyBtn: document.querySelector("#saveKeyBtn"),
  importLeagueBtn: document.querySelector("#importLeagueBtn"),
  syncBtn: document.querySelector("#syncBtn"),
  testModeBtn: document.querySelector("#testModeBtn"),
  syncStatus: document.querySelector("#syncStatus"),
  seasonBonusList: document.querySelector("#seasonBonusList"),
  seasonBonusTotal: document.querySelector("#seasonBonusTotal"),
  playerStats: document.querySelector("#playerStats"),
  statsCount: document.querySelector("#statsCount"),
  nextMatchLabel: document.querySelector("#nextMatchLabel"),
  nextMatchTeams: document.querySelector("#nextMatchTeams"),
  matchTemplate: document.querySelector("#matchTemplate"),
  adminOnly: document.querySelectorAll(".admin-only"),
  mobileTabs: document.querySelectorAll("[data-mobile-tab]"),
  mobilePanels: document.querySelectorAll("[data-mobile-panel]"),
};

setupAccessGate();
setupMobileTabs();

els.apiKey.value = localStorage.getItem(apiKeyStorageKey) ?? "";

function setupAccessGate() {
  const unlocked = localStorage.getItem(accessStorageKey) === "true";
  if (unlocked) {
    els.accessGate.hidden = true;
    els.appShell.hidden = false;
    return;
  }

  els.accessGate.hidden = false;
  els.appShell.hidden = true;
  els.accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = els.accessPassword.value.trim().toUpperCase();
    if (value !== sitePassword) {
      els.accessError.hidden = false;
      els.accessPassword.select();
      return;
    }
    localStorage.setItem(accessStorageKey, "true");
    els.accessGate.hidden = true;
    els.appShell.hidden = false;
  });
}

function setupMobileTabs() {
  els.mobileTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setMobileTab(tab.dataset.mobileTab);
    });
  });
  setMobileTab("matches");
}

function setMobileTab(tabName) {
  document.body.dataset.mobileTab = tabName;
  els.mobileTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.mobileTab === tabName);
  });
  els.mobilePanels.forEach((panel) => {
    panel.classList.toggle("is-mobile-active", panel.dataset.mobilePanel === tabName);
  });
}

els.signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = clean(els.signupName.value);
  const pin = els.signupPin.value.trim();
  if (!name || !pin) return;
  if (state.users.some((user) => same(user.name, name))) {
    alert("Ce pseudo existe déjà.");
    return;
  }
  const user = { id: crypto.randomUUID(), name, pin, createdAt: Date.now() };
  state.users.push(user);
  setCurrentUser(user.id);
  els.signupForm.reset();
  persist();
});

els.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = state.users.find((item) => item.id === els.loginUser.value);
  if (!user || user.pin !== els.loginPin.value.trim()) {
    alert("Pseudo ou PIN incorrect.");
    return;
  }
  setCurrentUser(user.id);
  els.loginPin.value = "";
  persist();
});

els.logoutBtn.addEventListener("click", () => {
  setCurrentUser(null);
  persist();
});

els.matchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requireAdmin()) return;
  const teamA = clean(els.teamA.value);
  const teamB = clean(els.teamB.value);
  if (!teamA || !teamB) return;

  upsertMatch({
    id: crypto.randomUUID(),
    externalId: null,
    teamA,
    teamB,
    date: els.matchDate.value,
    matchday: Number(els.matchday.value) || null,
    status: "SCHEDULED",
    result: { a: "", b: "" },
    predictions: {},
  });

  els.matchForm.reset();
  persist();
});

els.matchdayFilter.addEventListener("change", () => {
  state.matchdayFilter = els.matchdayFilter.value;
  persist();
});

els.refreshStateBtn.addEventListener("click", async () => {
  await forceRemoteSync();
});

els.seasonBonusList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-bonus-id]");
  if (!input) return;

  if (input.dataset.role === "official") {
    if (!isAdmin()) return;
    state.seasonBonus.official[input.dataset.bonusId] = clean(input.value);
  } else {
    if (isSeasonLocked() && !state.testMode) {
      alert("Les bonus saison sont verrouillés après le début du championnat.");
      render();
      return;
    }
    const user = currentUser();
    if (!user) return;
    state.seasonBonus.predictions[user.id] = state.seasonBonus.predictions[user.id] ?? {};
    state.seasonBonus.predictions[user.id][input.dataset.bonusId] = clean(input.value);
  }

  persist();
});

els.saveKeyBtn.addEventListener("click", async () => {
  if (!requireAdmin()) return;
  await saveApiKey();
});

els.importLeagueBtn.addEventListener("click", () => syncPremierLeague());
els.syncBtn.addEventListener("click", () => syncPremierLeague());
els.testModeBtn.addEventListener("click", () => applyTestMode());

els.resetBtn.addEventListener("click", () => {
  if (!requireAdmin()) return;
  if (!confirm("Tout effacer ?")) return;
  localStorage.removeItem(testModeStorageKey);
  state = structuredClone(defaultState);
  persist();
});

els.exportBtn.addEventListener("click", () => {
  if (!requireAdmin()) return;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "novaprono.json";
  link.click();
  URL.revokeObjectURL(url);
});

els.importInput.addEventListener("change", async (event) => {
  if (!requireAdmin()) {
    event.target.value = "";
    return;
  }
  const [file] = event.target.files;
  if (!file) return;

  try {
    const imported = migrateState(JSON.parse(await file.text()));
    if (!Array.isArray(imported.users) || !Array.isArray(imported.matches)) {
      throw new Error("Format invalide");
    }
    state = imported;
    persist();
  } catch {
    alert("Impossible d'importer ce fichier.");
  } finally {
    event.target.value = "";
  }
});

window.addEventListener("storage", (event) => {
  if (event.key !== storageKey || !event.newValue) return;
  try {
    state = migrateState(JSON.parse(event.newValue));
    render();
  } catch (error) {
    console.error(error);
  }
});

async function syncPremierLeague(silent = false) {
  if (location.protocol === "file:") {
    setStatus("Ouvre NovaProno avec le serveur local pour importer les vrais matchs.");
    if (!silent) alert("L'import API ne marche pas en ouvrant le fichier directement. Lance le serveur local NovaProno, puis ouvre http://localhost:5173");
    return;
  }

  setStatus("Synchronisation en cours...");
  try {
    const url = `/api/premier-league?season=${seasonYear}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur API ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.matches)) throw new Error("Réponse API invalide");
    data.matches.forEach((match) => upsertMatch(fromApiMatch(match)));
    state.lastSync = new Date().toISOString();
    persist();
    setStatus(`${data.matches.length} matchs Premier League 2026-2027 synchronisés.`);
  } catch (error) {
    setStatus("Synchronisation impossible depuis ce navigateur. Vérifie la clé API ou le blocage CORS.");
    if (!silent) alert("La synchronisation n'a pas fonctionné. Vérifie la clé API.");
    console.error(error);
  }
}

async function saveApiKey() {
  const key = els.apiKey.value.trim();
  if (!key) {
    alert("Ajoute une clé avant de l'enregistrer.");
    return;
  }

  localStorage.setItem(apiKeyStorageKey, key);

  if (location.protocol === "file:") {
    setStatus("Clé gardée dans ce navigateur. Lance le serveur local pour l'import automatique.");
    return;
  }

  try {
    const response = await fetch("/api/key", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    setStatus("Clé gardée dans le serveur local. Synchronisation automatique active.");
    ensureAutoSync();
    await syncPremierLeague(true);
  } catch (error) {
    setStatus("Impossible d'enregistrer la clé dans le serveur local.");
    console.error(error);
  }
}

function fromApiMatch(match) {
  const fullTime = match.score?.fullTime ?? {};
  const hasFullTime = Number.isInteger(fullTime.home) && Number.isInteger(fullTime.away);
  return {
    id: `fd-${match.id}`,
    externalId: String(match.id),
    teamA: match.homeTeam?.shortName || match.homeTeam?.name || "Domicile",
    teamB: match.awayTeam?.shortName || match.awayTeam?.name || "Extérieur",
    date: match.utcDate ? toInputDate(new Date(match.utcDate)) : "",
    matchday: match.matchday ?? null,
    status: match.status ?? "SCHEDULED",
    result: {
      a: hasFullTime ? String(fullTime.home) : "",
      b: hasFullTime ? String(fullTime.away) : "",
    },
    predictions: {},
  };
}

function removeDemoMatches() {
  const before = state.matches.length;
  state.matches = state.matches.filter((match) => {
    const externalId = String(match.externalId ?? "");
    const id = String(match.id ?? "");
    return !externalId.startsWith("demo-") && !externalId.startsWith("sample-") && !id.startsWith("demo-");
  });
  return state.matches.length !== before;
}

function render() {
  renderUsers();
  renderMatchdayFilter();
  renderMatches();
  renderSeasonBonus();
  renderLeaderboard();
  renderPlayerStats();
  renderHeaderStats();
  renderSession();
  renderAdminControls();
}

function renderUsers() {
  els.friendCount.textContent = state.users.length;
  els.loginUser.innerHTML = "";

  if (state.users.length === 0) {
    els.loginUser.innerHTML = '<option value="">Aucun inscrit</option>';
    els.friendList.innerHTML = '<li class="empty-state">Inscris le premier joueur.</li>';
    return;
  }

  state.users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    els.loginUser.append(option);
  });

  els.friendList.innerHTML = "";
  state.users.forEach((user) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const button = document.createElement("button");
    name.textContent = user.name;
    button.type = "button";
    button.textContent = "×";
    button.title = `Retirer ${user.name}`;
    button.addEventListener("click", () => removeUser(user.id));
    item.append(name, button);
    els.friendList.append(item);
  });
}

function renderSession() {
  const user = currentUser();
  els.sessionLabel.textContent = user ? `Connecté: ${user.name}${isAdmin() ? " · admin" : ""}` : "Non connecté";
}

function renderSeasonBonus() {
  const user = currentUser();
  const locked = isSeasonLocked();
  els.seasonBonusList.innerHTML = "";
  els.seasonBonusTotal.textContent = user ? `${seasonBonusPointsFor(user.id)} pts` : "0";

  if (!user) {
    els.seasonBonusList.innerHTML = '<p class="empty-state">Connecte-toi pour remplir tes bonus saison.</p>';
    return;
  }

  const userBonus = state.seasonBonus.predictions[user.id] ?? {};
  seasonBonusCategories.forEach((category) => {
    const row = document.createElement("div");
    row.className = `bonus-row${locked ? " is-locked" : ""}`;
    row.innerHTML = `
      <div>
        <strong>${category.label}</strong>
        <span>${category.points} pts</span>
      </div>
      <label>
        Ton choix
        <input data-role="prediction" data-bonus-id="${category.id}" type="text" autocomplete="off" />
      </label>
      <label class="admin-only">
        Réponse officielle
        <input data-role="official" data-bonus-id="${category.id}" type="text" autocomplete="off" />
      </label>
      <b>${seasonBonusCategoryPoints(user.id, category)} pts</b>
    `;

    const predictionInput = row.querySelector('[data-role="prediction"]');
    predictionInput.value = userBonus[category.id] ?? "";
    predictionInput.disabled = locked;
    predictionInput.title = locked ? "Bonus verrouillé après le début du championnat" : "";
    row.querySelector('[data-role="official"]').value = state.seasonBonus.official[category.id] ?? "";
    els.seasonBonusList.append(row);
  });

  if (locked) {
    els.seasonBonusList.append(renderPublicSeasonBonus());
  }
}

function renderAdminControls() {
  const visible = isAdmin();
  els.adminOnly.forEach((element) => {
    element.hidden = !visible;
  });
  ensureAutoSync();
}

function ensureAutoSync() {
  const canSync = location.protocol !== "file:";

  if (!canSync) {
    if (autoSyncTimer) {
      clearInterval(autoSyncTimer);
      autoSyncTimer = null;
    }
    return;
  }

  if (autoSyncTimer) return;
  setTimeout(() => syncPremierLeague(true), 800);
  autoSyncTimer = setInterval(() => syncPremierLeague(true), autoSyncEveryMs);
}

function renderMatchdayFilter() {
  const days = [...new Set(state.matches.map((match) => match.matchday).filter(Boolean))].sort((a, b) => a - b);
  const current = state.matchdayFilter ?? "all";
  els.matchdayFilter.innerHTML = '<option value="all">Toutes</option>';
  days.forEach((day) => {
    const option = document.createElement("option");
    option.value = String(day);
    option.textContent = `Journée ${day}`;
    els.matchdayFilter.append(option);
  });
  els.matchdayFilter.value = days.includes(Number(current)) ? current : "all";
  state.matchdayFilter = els.matchdayFilter.value;
}

function renderMatches() {
  els.matchCount.textContent = state.matches.length;
  els.matchList.innerHTML = "";
  const matches = filteredMatches();

  if (matches.length === 0) {
    els.matchList.innerHTML = '<p class="empty-state">Aucun vrai match importé. Mets ta clé API puis clique sur Importer PL.</p>';
    return;
  }

  matches.forEach((match) => {
    const node = els.matchTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector("h4").textContent = `${match.teamA} - ${match.teamB}`;
    node.querySelector(".match-date").textContent = matchMeta(match);
    node.querySelector(".official-score").textContent = officialScoreLabel(match);

    const removeButton = node.querySelector(".remove-match");
    removeButton.hidden = !isAdmin();
    removeButton.addEventListener("click", () => removeMatch(match.id));
    renderPredictions(node.querySelector(".prediction-list"), match);
    els.matchList.append(node);
  });
}

function renderPredictions(container, match) {
  container.innerHTML = "";
  if (state.users.length === 0) {
    container.innerHTML = '<p class="empty-state">Inscris au moins un joueur.</p>';
    return;
  }

  const user = currentUser();
  if (!user) {
    container.innerHTML = '<p class="empty-state">Connecte-toi pour saisir ton prono.</p>';
    return;
  }

  const locked = isMatchLocked(match);
  const isTestMatch = state.testMode && match.status === "TEST";
  const inputsLocked = locked && !isTestMatch;
  const showPublicPredictions = locked || isTestMatch;
  const prediction = match.predictions[user.id] ?? { a: "", b: "" };
  const row = document.createElement("div");
  row.className = "prediction-row";

  const name = document.createElement("span");
  name.className = "friend-name";
  name.textContent = `Prono de ${user.name}`;

  const inputs = document.createElement("span");
  inputs.className = "score-inputs";
  const inputA = scoreInput(prediction.a);
  const dash = document.createElement("b");
  const inputB = scoreInput(prediction.b);
  dash.textContent = "-";
  inputA.disabled = inputsLocked;
  inputB.disabled = inputsLocked;
  if (inputsLocked) {
    row.classList.add("is-locked");
    inputA.title = "Prono verrouillé après le début du match";
    inputB.title = "Prono verrouillé après le début du match";
  }
  inputA.addEventListener("change", () => {
    updatePrediction(match.id, user.id, "a", inputA.value);
    refreshTestPredictionPoints(match, user.id, points);
  });
  inputB.addEventListener("change", () => {
    updatePrediction(match.id, user.id, "b", inputB.value);
    refreshTestPredictionPoints(match, user.id, points);
  });
  inputs.append(inputA, dash, inputB);

  const points = document.createElement("span");
  points.className = "prediction-points";
  points.innerHTML = `<strong>${pointsFor(match, user.id)}</strong> pts`;

  if (inputsLocked) {
    const lock = document.createElement("span");
    lock.className = "lock-label";
    lock.textContent = "Verrouillé";
    row.append(name, inputs, points, lock);
  } else {
    row.append(name, inputs, points);
  }
  container.append(row);

  if (showPublicPredictions) {
    container.append(renderPublicMatchPredictions(match));
  }
}

function renderPublicMatchPredictions(match) {
  const box = document.createElement("div");
  box.className = "public-predictions";
  box.innerHTML = "<strong>Pronostics des joueurs</strong>";

  state.users.forEach((user) => {
    const prediction = match.predictions[user.id];
    const item = document.createElement("p");
    const score = hasScore(prediction) ? `${prediction.a} - ${prediction.b}` : "Aucun prono";
    const points = pointsFor(match, user.id);
    item.innerHTML = `<span></span><b><span>${score}</span><small>${points} pts</small></b>`;
    item.querySelector("span").textContent = user.name;
    box.append(item);
  });

  return box;
}

function refreshTestPredictionPoints(match, userId, pointsElement) {
  if (!(state.testMode && match.status === "TEST")) return;
  pointsElement.innerHTML = `<strong>${pointsFor(match, userId)}</strong> pts`;
  const publicPredictions = pointsElement.closest(".prediction-list")?.querySelector(".public-predictions");
  if (publicPredictions) publicPredictions.replaceWith(renderPublicMatchPredictions(match));
  renderLeaderboard();
}

function renderPublicSeasonBonus() {
  const box = document.createElement("div");
  box.className = "public-bonus";
  box.innerHTML = "<strong>Pronostics bonus des joueurs</strong>";

  state.users.forEach((user) => {
    const userBonus = state.seasonBonus.predictions[user.id] ?? {};
    const card = document.createElement("article");
    card.innerHTML = `<h4></h4>`;
    card.querySelector("h4").textContent = user.name;

    seasonBonusCategories.forEach((category) => {
      const item = document.createElement("p");
      item.innerHTML = `<span></span><b></b>`;
      item.querySelector("span").textContent = category.label;
      item.querySelector("b").textContent = userBonus[category.id] || "Aucun prono";
      card.append(item);
    });

    box.append(card);
  });

  return box;
}

function renderLeaderboard() {
  const rows = standings();
  els.leaderboard.innerHTML = "";

  if (rows.length === 0) {
    els.leaderboard.innerHTML = '<p class="empty-state">Classement vide.</p>';
    return;
  }

  const days = leaderboardDays();
  const table = document.createElement("table");
  table.className = "leader-table";
  const header = document.createElement("thead");
  header.innerHTML = `
    <tr>
      <th>Joueur</th>
      <th>Total</th>
      <th>Bonus</th>
    </tr>
  `;
  const headerRow = header.querySelector("tr");
  days.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = `J${day}`;
    headerRow.append(th);
  });

  const body = document.createElement("tbody");
  rows.forEach((user, index) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.className = "leader-player";
    nameCell.innerHTML = `<span>${index + 1}</span><strong></strong>`;
    nameCell.querySelector("strong").textContent = user.name;

    const totalCell = document.createElement("td");
    totalCell.className = "leader-total";
    totalCell.textContent = `${user.points} pts`;

    const bonus = seasonBonusDetailsFor(user.id);
    const bonusCell = document.createElement("td");
    bonusCell.textContent = bonus.available ? `${bonus.points} pts` : "-";

    row.append(nameCell, totalCell, bonusCell);
    days.forEach((day) => {
      const detail = matchdayDetailFor(user.id, day);
      const cell = document.createElement("td");
      cell.innerHTML = detail.html;
      if (detail.winner) cell.className = "day-winner";
      row.append(cell);
    });
    body.append(row);
  });

  table.append(header, body);
  els.leaderboard.append(table);
}

function renderPlayerStats() {
  els.playerStats.innerHTML = "";
  els.statsCount.textContent = state.users.length;

  if (state.users.length === 0) {
    els.playerStats.innerHTML = '<p class="empty-state">Aucun joueur inscrit.</p>';
    return;
  }

  standings().forEach((user) => {
    const stats = playerStatsFor(user.id);
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-title">
        <h4></h4>
        <strong>${stats.total} pts</strong>
      </div>
      <div class="stat-grid">
        <span><b>${stats.predictions}</b> pronos</span>
        <span><b>${stats.exactScores}</b> scores exacts</span>
        <span><b>${stats.goodResults}</b> bons résultats</span>
        <span><b>${stats.dayWins}</b> journées gagnées</span>
        <span><b>${stats.matchPoints}</b> pts matchs</span>
        <span><b>${stats.seasonBonus}</b> pts bonus</span>
        <span><b>${stats.average}</b> pts/prono</span>
      </div>
    `;
    card.querySelector("h4").textContent = user.name;
    els.playerStats.append(card);
  });
}

function renderHeaderStats() {
  const upcoming = sortedMatches().find((match) => !hasResult(match));
  if (!upcoming) {
    els.nextMatchLabel.textContent = state.matches.length ? "Résultats à jour" : "Aucun match";
    els.nextMatchTeams.textContent = state.matches.length ? "Classement calculé" : "Importe la saison 26-27";
    return;
  }

  els.nextMatchLabel.textContent = upcoming.date ? formatDate(upcoming.date) : "Prochain match";
  els.nextMatchTeams.textContent = `${upcoming.teamA} - ${upcoming.teamB}`;
}

function standings() {
  const baseRows = state.users.map((user) => ({
    ...user,
    points: state.matches.reduce((sum, match) => sum + pointsFor(match, user.id), 0) + seasonBonusPointsFor(user.id),
  }));

  bonusByUser().forEach((bonus, userId) => {
    const row = baseRows.find((user) => user.id === userId);
    if (row) row.points += bonus;
  });

  return baseRows.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

function bonusByUser() {
  const bonus = new Map();
  const days = [...new Set(state.matches.map((match) => match.matchday).filter(Boolean))];
  days.forEach((day) => {
    const matches = state.matches.filter((match) => match.matchday === day && hasResult(match));
    if (matches.length === 0) return;
    const scores = state.users.map((user) => ({
      id: user.id,
      points: matches.reduce((sum, match) => sum + pointsFor(match, user.id), 0),
    }));
    const best = Math.max(...scores.map((row) => row.points));
    if (best <= 0) return;
    scores.filter((row) => row.points === best).forEach((row) => {
      bonus.set(row.id, (bonus.get(row.id) ?? 0) + 3);
    });
  });
  return bonus;
}

function leaderboardDays() {
  return [...new Set(state.matches.map((match) => match.matchday).filter(Boolean))].sort((a, b) => a - b);
}

function matchdayDetailFor(userId, day) {
  const matches = state.matches.filter((match) => match.matchday === day && hasResult(match));
  const points = matches.reduce((sum, match) => sum + pointsFor(match, userId), 0);
  const allScores = state.users.map((user) => matches.reduce((sum, match) => sum + pointsFor(match, user.id), 0));
  const best = allScores.length ? Math.max(...allScores) : 0;
  const winner = best > 0 && points === best;
  const winnerBonus = winner ? 3 : 0;
  const total = points + winnerBonus;
  return {
    day,
    points,
    winner,
    winnerBonus,
    total,
    html: total > 0 ? `<strong>${total} pts</strong><span>${points}+${winnerBonus}</span>` : "-",
  };
}

function matchdayDetailsFor(userId) {
  return leaderboardDays().map((day) => matchdayDetailFor(userId, day)).filter((detail) => detail.points > 0 || detail.winner);
}

function seasonBonusDetailsFor(userId) {
  const available = seasonBonusCategories.some((category) => Boolean(state.seasonBonus.official[category.id]));
  return { available, points: seasonBonusPointsFor(userId) };
}

function playerStatsFor(userId) {
  const resultMatches = state.matches.filter((match) => hasResult(match));
  const predictedMatches = resultMatches.filter((match) => hasScore(match.predictions[userId]));
  const matchPoints = resultMatches.reduce((sum, match) => sum + pointsFor(match, userId), 0);
  const dayWins = matchdayDetailsFor(userId).filter((detail) => detail.winner).length;
  const seasonBonus = seasonBonusPointsFor(userId);
  const exactScores = predictedMatches.filter((match) => {
    const prediction = match.predictions[userId];
    return Number(match.result.a) === Number(prediction.a) && Number(match.result.b) === Number(prediction.b);
  }).length;
  const goodResults = predictedMatches.filter((match) => {
    const prediction = match.predictions[userId];
    return outcome(Number(match.result.a), Number(match.result.b)) === outcome(Number(prediction.a), Number(prediction.b));
  }).length;

  return {
    predictions: predictedMatches.length,
    exactScores,
    goodResults,
    dayWins,
    matchPoints,
    seasonBonus,
    total: matchPoints + seasonBonus + dayWins * 3,
    average: predictedMatches.length ? (matchPoints / predictedMatches.length).toFixed(1) : "0.0",
  };
}

function seasonBonusPointsFor(userId) {
  return seasonBonusCategories.reduce((sum, category) => sum + seasonBonusCategoryPoints(userId, category), 0);
}

function seasonBonusCategoryPoints(userId, category) {
  const prediction = state.seasonBonus.predictions[userId]?.[category.id] ?? "";
  const official = state.seasonBonus.official[category.id] ?? "";
  if (!prediction || !official) return 0;
  return same(prediction, official) ? category.points : 0;
}

function pointsFor(match, userId) {
  if (!hasResult(match)) return 0;
  const prediction = match.predictions[userId];
  if (!hasScore(prediction)) return 0;

  const resultA = Number(match.result.a);
  const resultB = Number(match.result.b);
  const predA = Number(prediction.a);
  const predB = Number(prediction.b);
  const exactScore = resultA === predA && resultB === predB;
  const sameOutcome = outcome(resultA, resultB) === outcome(predA, predB);
  const sameDiff = resultA - resultB === predA - predB;

  if (exactScore) return 6;

  let points = 0;
  if (resultA === predA) points += 1;
  if (resultB === predB) points += 1;
  if (sameOutcome) points += 2;
  if (sameDiff) points += 1;
  return points;
}

function updatePrediction(matchId, userId, side, value) {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) return;
  if (isMatchLocked(match) && !(state.testMode && match.status === "TEST")) {
    alert("Les pronostics sont verrouillés après le début du match.");
    render();
    return;
  }
  match.predictions[userId] = match.predictions[userId] ?? { a: "", b: "" };
  match.predictions[userId][side] = value;
  match.predictions[userId][`${side}UpdatedAt`] = Date.now();
  setRemoteStatus("Prono modifié...");
  persist();
}

function removeUser(userId) {
  if (!requireAdmin()) return;
  const user = state.users.find((item) => item.id === userId);
  markDeletedUser(user);
  state.users = state.users.filter((user) => user.id !== userId);
  state.matches.forEach((match) => delete match.predictions[userId]);
  delete state.seasonBonus.predictions[userId];
  if (currentUserId === userId) setCurrentUser(null);
  persist();
}

function removeMatch(matchId) {
  if (!requireAdmin()) return;
  state.matches = state.matches.filter((match) => match.id !== matchId);
  persist();
}

function applyTestMode() {
  if (!currentUser()) {
    alert("Connecte-toi pour lancer le mode test.");
    return;
  }
  const matches = ensureTestMatches();

  if (matches.length === 0) {
    alert("Aucun match de première journée à tester.");
    return;
  }

  const fakeScores = [
    { a: "2", b: "1" },
    { a: "1", b: "1" },
    { a: "0", b: "2" },
    { a: "3", b: "2" },
    { a: "2", b: "0" },
    { a: "1", b: "2" },
  ];

  matches.forEach((match, index) => {
    if (String(match.externalId ?? "").startsWith("test-")) {
      const testDate = new Date(Date.now() + (index + 1) * 60 * 60 * 1000);
      match.date = testDate.toISOString();
    }
    match.result = fakeScores[index];
    match.status = "TEST";
  });

  applyTestSeasonBonus();
  state.testMode = true;
  localStorage.setItem(testModeStorageKey, "true");
  setStatus("Mode test activé : matchs et bonus fictifs ajoutés.");
  persist();
}

function applyTestSeasonBonus() {
  const official = {
    champion: "Arsenal",
    bestAttack: "Manchester City",
    bestDefense: "Liverpool",
    topScorer: "Erling Haaland",
    bestAssister: "Kevin De Bruyne",
    goldenGloves: "Alisson",
    bestPlayer: "Bukayo Saka",
  };
  const alternatives = {
    champion: "Liverpool",
    bestAttack: "Arsenal",
    bestDefense: "Chelsea",
    topScorer: "Mohamed Salah",
    bestAssister: "Bruno Fernandes",
    goldenGloves: "David Raya",
    bestPlayer: "Cole Palmer",
  };

  state.seasonBonus.official = { ...state.seasonBonus.official, ...official };
  state.users.forEach((user, userIndex) => {
    state.seasonBonus.predictions[user.id] = state.seasonBonus.predictions[user.id] ?? {};
    seasonBonusCategories.forEach((category, categoryIndex) => {
      if (!state.seasonBonus.predictions[user.id][category.id]) {
        state.seasonBonus.predictions[user.id][category.id] =
          (userIndex + categoryIndex) % 2 === 0 ? official[category.id] : alternatives[category.id];
      }
    });
  });
}

function ensureTestMatches() {
  const existing = state.matches.filter((match) => match.status === "TEST");
  if (existing.length >= 6) return existing.slice(0, 6);
  const previous = new Map(existing.map((match) => [match.externalId, match]));
  state.matches = state.matches.filter((match) => match.status !== "TEST");
  const matches = createTestMatches();
  matches.forEach((match) => {
    const oldMatch = previous.get(match.externalId);
    if (oldMatch) match.predictions = oldMatch.predictions ?? {};
  });
  return matches;
}

function createTestMatches() {
  const kickoff = new Date(Date.now() + 60 * 60 * 1000);
  const teams = [
    ["Arsenal", "Liverpool"],
    ["Chelsea", "Manchester United"],
    ["Tottenham", "Manchester City"],
    ["Everton", "Newcastle"],
    ["Aston Villa", "West Ham"],
    ["Brighton", "Fulham"],
  ];

  const matches = teams.map(([teamA, teamB], index) => ({
    id: crypto.randomUUID(),
    externalId: `test-${index + 1}`,
    teamA,
    teamB,
    date: new Date(kickoff.getTime() + index * 60 * 60 * 1000).toISOString(),
    matchday: index < 3 ? 1 : 2,
    status: "TEST",
    result: { a: "", b: "" },
    predictions: {},
  }));

  state.matches.push(...matches);
  return matches;
}

function firstMatchday() {
  const days = state.matches.map((match) => match.matchday).filter((day) => day !== null && day !== undefined);
  return days.length ? Math.min(...days) : null;
}

function upsertMatch(nextMatch) {
  const existing = state.matches.find((match) => {
    return (nextMatch.externalId && match.externalId === nextMatch.externalId) || match.id === nextMatch.id;
  });

  if (!existing) {
    state.matches.push(nextMatch);
    return;
  }

  Object.assign(existing, nextMatch, {
    predictions: existing.predictions ?? {},
  });
}

function filteredMatches() {
  const filter = state.matchdayFilter ?? "all";
  return sortedMatches().filter((match) => filter === "all" || String(match.matchday) === filter);
}

function sortedMatches() {
  return [...state.matches].sort((a, b) => {
    if ((a.matchday ?? 999) !== (b.matchday ?? 999)) return (a.matchday ?? 999) - (b.matchday ?? 999);
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });
}

function matchMeta(match) {
  const parts = [];
  if (match.matchday) parts.push(`Journée ${match.matchday}`);
  parts.push(formatDate(match.date));
  if (match.status) parts.push(match.status);
  return parts.join(" · ");
}

function officialScoreLabel(match) {
  if (!hasResult(match)) return "En attente API";
  return `${match.result.a} - ${match.result.b}`;
}

function isMatchLocked(match) {
  if (!match.date) return false;
  const kickoff = new Date(match.date);
  if (Number.isNaN(kickoff.getTime())) return false;
  return Date.now() >= kickoff.getTime();
}

function isSeasonLocked() {
  const firstMatch = sortedMatches().find((match) => match.date);
  return firstMatch ? isMatchLocked(firstMatch) : false;
}

function currentUser() {
  return state.users.find((user) => user.id === currentUserId) ?? null;
}

function setCurrentUser(userId) {
  currentUserId = userId;
  if (userId) {
    localStorage.setItem(sessionUserStorageKey, userId);
  } else {
    localStorage.removeItem(sessionUserStorageKey);
  }
}

function isAdmin() {
  const user = currentUser();
  return Boolean(user && same(user.name, adminName));
}

function requireAdmin() {
  if (isAdmin()) return true;
  alert("Action réservée à Norbert.");
  return false;
}

function hasResult(match) {
  return hasScore(match?.result);
}

function hasScore(score) {
  return score && score.a !== "" && score.b !== "" && score.a !== null && score.b !== null;
}

function persist() {
  lastLocalChangeAt = Date.now();
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();
  queueRemoteSave();
}

function persistLocalOnly() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  render();
}

function queueRemoteSave() {
  if (location.protocol === "file:") return;
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(() => saveRemoteState(), 250);
}

async function saveRemoteState() {
  try {
    setRemoteStatus("Envoi...");
    const response = await fetch("/api/state", {
      method: "PUT",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: stateForRemote() }),
    });
    if (!response.ok) {
      setRemoteStatus(await errorLabel(response));
      return;
    }
    const payload = await response.json();
    if (!payload.state) {
      setRemoteStatus("Serveur vide");
      return;
    }
    state = mergeClientStates(state, migrateState(payload.state));
    localStorage.setItem(storageKey, JSON.stringify(state));
    render();
    setRemoteStatus(`Synchro OK · ${state.users.length} joueur${state.users.length > 1 ? "s" : ""}`);
  } catch (error) {
    setRemoteStatus("Erreur synchro");
    console.error(error);
  }
}

async function loadRemoteState(force = false) {
  if (location.protocol === "file:") return;
  if (!force && Date.now() - lastLocalChangeAt < 2000) return;
  if (!force && isEditingField()) return;
  try {
    setRemoteStatus("Lecture...");
    const response = await fetch(`/api/state?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      setRemoteStatus(await errorLabel(response));
      return;
    }
    const payload = await response.json();
    if (!payload.state) {
      await saveRemoteState();
      return;
    }
    const wasTesting = state.testMode || localStorage.getItem(testModeStorageKey) === "true";
    const testMatches = state.matches.filter((match) => match.status === "TEST");
    state = mergeClientStates(state, migrateState(payload.state));
    if (wasTesting) {
      state.testMode = true;
      const existingIds = new Set(state.matches.map((match) => match.externalId || match.id));
      testMatches.forEach((match) => {
        const key = match.externalId || match.id;
        if (!existingIds.has(key)) state.matches.push(match);
      });
    }
    localStorage.setItem(storageKey, JSON.stringify(state));
    render();
    setRemoteStatus(`Synchro OK · ${state.users.length} joueur${state.users.length > 1 ? "s" : ""}`);
  } catch (error) {
    setRemoteStatus("Erreur synchro");
    console.error(error);
  }
}

async function forceRemoteSync() {
  if (location.protocol === "file:") {
    setRemoteStatus("Serveur requis");
    return;
  }
  await loadRemoteState(true);
  await saveRemoteState();
}

function startRemoteRefresh() {
  if (location.protocol === "file:" || remoteRefreshTimer) return;
  remoteRefreshTimer = setInterval(() => loadRemoteState(), 5000);
  window.addEventListener("focus", () => loadRemoteState(true));
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) loadRemoteState(true);
  });
}

function isEditingField() {
  return ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName);
}

function stateForRemote() {
  const copy = structuredClone(state);
  delete copy.currentUserId;
  return copy;
}

function mergeClientStates(localState, remoteState) {
  const deletedUsers = mergeClientDeletedUsers(remoteState.deletedUsers, localState.deletedUsers);
  const userMerge = mergeClientUsers(remoteState.users, localState.users, deletedUsers);
  if (currentUserId && userMerge.aliases[currentUserId]) setCurrentUser(userMerge.aliases[currentUserId]);
  if (currentUserId && userMerge.aliases[currentUserId] === null) setCurrentUser(null);
  return {
    ...remoteState,
    ...localState,
    deletedUsers,
    users: userMerge.users,
    matches: mergeClientMatches(remoteState.matches, localState.matches, userMerge.aliases, deletedUsers),
    seasonBonus: mergeClientSeasonBonus(remoteState.seasonBonus, localState.seasonBonus, userMerge.aliases, deletedUsers),
  };
}

function mergeClientUsers(remoteUsers = [], localUsers = [], deletedUsers = {}) {
  const usersById = new Map();
  const idByName = new Map();
  const aliases = {};
  [...remoteUsers, ...localUsers].forEach((user) => {
    if (!user?.id) return;
    const nameKey = normalizeName(user.name);
    if (isDeletedUser(user, deletedUsers)) {
      aliases[user.id] = null;
      return;
    }
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

function mergeClientMatches(remoteMatches = [], localMatches = [], aliases = {}, deletedUsers = {}) {
  const matches = new Map();
  [...remoteMatches, ...localMatches].forEach((match) => {
    const key = match?.externalId || match?.id;
    if (!key) return;
    const previous = matches.get(key) || {};
    matches.set(key, {
      ...previous,
      ...match,
      predictions: mergeClientPredictions(previous.predictions, match.predictions, aliases, deletedUsers),
    });
  });
  return [...matches.values()];
}

function mergeClientPredictions(previousPredictions = {}, nextPredictions = {}, aliases = {}, deletedUsers = {}) {
  const predictions = {};
  [previousPredictions, nextPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, prediction]) => {
      addClientPrediction(predictions, userId, prediction, aliases, deletedUsers);
    });
  });
  return predictions;
}

function addClientPrediction(predictions, userId, prediction, aliases = {}, deletedUsers = {}) {
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

function mergeClientSeasonBonus(remoteBonus = {}, localBonus = {}, aliases = {}, deletedUsers = {}) {
  return {
    official: {
      ...(remoteBonus.official || {}),
      ...(localBonus.official || {}),
    },
    predictions: mergeClientBonusPredictions(remoteBonus.predictions, localBonus.predictions, aliases, deletedUsers),
  };
}

function mergeClientBonusPredictions(remotePredictions = {}, localPredictions = {}, aliases = {}, deletedUsers = {}) {
  const predictions = {};
  [remotePredictions, localPredictions].forEach((source) => {
    Object.entries(source || {}).forEach(([userId, bonus]) => {
      if (aliases[userId] === null || deletedUsers?.ids?.[userId]) return;
      const canonicalId = aliases[userId] || userId;
      if (deletedUsers?.ids?.[canonicalId]) return;
      predictions[canonicalId] = { ...(predictions[canonicalId] || {}), ...bonus };
    });
  });
  return predictions;
}

function markDeletedUser(user) {
  if (!user?.id) return;
  state.deletedUsers = normalizeDeletedUsers(state.deletedUsers);
  state.deletedUsers.ids[user.id] = Date.now();
  const nameKey = normalizeName(user.name);
  if (nameKey) state.deletedUsers.names[nameKey] = Date.now();
}

function mergeClientDeletedUsers(remoteDeleted = {}, localDeleted = {}) {
  const remote = normalizeDeletedUsers(remoteDeleted);
  const local = normalizeDeletedUsers(localDeleted);
  return {
    ids: mergeTimestampMaps(remote.ids, local.ids),
    names: mergeTimestampMaps(remote.names, local.names),
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

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored) return stored;
  } catch {
    localStorage.removeItem(storageKey);
  }
  return structuredClone(defaultState);
}

function migrateState(raw) {
  const next = structuredClone(defaultState);
  if (Array.isArray(raw.users)) next.users = raw.users;
  if (Array.isArray(raw.friends)) {
    next.users = raw.friends.map((friend) => ({ ...friend, pin: friend.pin ?? "1234" }));
  }
  if (Array.isArray(raw.matches)) next.matches = raw.matches.map((match) => ({
    id: match.id ?? crypto.randomUUID(),
    externalId: match.externalId ?? null,
    teamA: match.teamA,
    teamB: match.teamB,
    date: match.date ?? "",
    matchday: match.matchday ?? null,
    status: match.status ?? "SCHEDULED",
    result: match.result ?? { a: "", b: "" },
    predictions: match.predictions ?? {},
  }));
  next.seasonBonus = {
    official: raw.seasonBonus?.official ?? {},
    predictions: raw.seasonBonus?.predictions ?? {},
  };
  next.deletedUsers = normalizeDeletedUsers(raw.deletedUsers);
  next.currentUserId = raw.currentUserId ?? null;
  next.matchdayFilter = raw.matchdayFilter ?? "all";
  next.lastSync = raw.lastSync ?? null;
  next.testMode = Boolean(raw.testMode) || localStorage.getItem(testModeStorageKey) === "true";
  return next;
}

function scoreInput(value) {
  const select = document.createElement("select");
  select.className = "score-select";
  select.setAttribute("aria-label", "Score");

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "-";
  select.append(emptyOption);

  for (let score = 0; score <= 10; score += 1) {
    const option = document.createElement("option");
    option.value = String(score);
    option.textContent = String(score);
    select.append(option);
  }

  select.value = value ?? "";
  return select;
}

function formatDate(value) {
  if (!value) return "Date à définir";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toInputDate(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function outcome(a, b) {
  if (a === b) return "draw";
  return a > b ? "home" : "away";
}

function clean(value) {
  return value.trim().replace(/\s+/g, " ");
}

function same(a, b) {
  return a.localeCompare(b, "fr", { sensitivity: "base" }) === 0;
}

function setStatus(message) {
  els.syncStatus.textContent = message;
}

function setRemoteStatus(message) {
  if (els.remoteStatus) els.remoteStatus.textContent = message;
}

async function errorLabel(response) {
  try {
    const payload = await response.json();
    const detail = payload.detail ? ` · ${payload.detail}` : "";
    return shorten(`Erreur ${response.status}: ${payload.error || "synchro"}${detail}`, 260);
  } catch {
    return `Erreur ${response.status}: synchro`;
  }
}

function shorten(text, maxLength) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

render();
ensureAutoSync();
loadRemoteState();
startRemoteRefresh();
