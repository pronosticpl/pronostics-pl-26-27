const storageKey = "novaprono-construction-admin-v1";
const remoteStateKey = "bonusAdmin";
const accessKey = "novaprono-admin-access-v1";
const adminName = "norbert";
const adminPassword = "1234";

const bonusRows = [
  ["Draki", "Champion", "Arsenal"],
  ["Draki", "Meilleur buteur", "Erling Haaland"],
  ["Draki", "Meilleur gardien", "Raya"],
  ["Draki", "Meilleur joueur", "Saka"],
  ["Draki", "Meilleur passeur", "Bruno Fernandes"],
  ["Draki", "Meilleure attaque", "Manchester City"],
  ["Draki", "Meilleure défense", "Arsenal"],
  ["Gonçalo", "Champion", "Arsenal"],
  ["Gonçalo", "Meilleur buteur", "Erling Haaland"],
  ["Gonçalo", "Meilleur gardien", "David Raya"],
  ["Gonçalo", "Meilleur joueur", "Martin Ødegaard"],
  ["Gonçalo", "Meilleur passeur", "Bruno Fernandes"],
  ["Gonçalo", "Meilleure attaque", "Manchester City"],
  ["Gonçalo", "Meilleure défense", "Arsenal"],
  ["Guillaume", "Champion", "Arsenal"],
  ["Guillaume", "Meilleur buteur", "Erling Haaland"],
  ["Guillaume", "Meilleur gardien", "David Raya"],
  ["Guillaume", "Meilleur joueur", "Martin Ødegaard"],
  ["Guillaume", "Meilleur passeur", "Martin Ødegaard"],
  ["Guillaume", "Meilleure attaque", "Arsenal"],
  ["Guillaume", "Meilleure défense", "Liverpool"],
  ["Jojo", "Champion", "Arsenal"],
  ["Jojo", "Meilleur buteur", "Bryan Mbeumo"],
  ["Jojo", "Meilleur gardien", "Senne Lammens"],
  ["Jojo", "Meilleur joueur", "Bryan Mbeumo"],
  ["Jojo", "Meilleur passeur", "Bruno Fernandes"],
  ["Jojo", "Meilleure attaque", "Manchester United"],
  ["Jojo", "Meilleure défense", "Arsenal"],
  ["MaxouCod", "Champion", "Manchester City"],
  ["MaxouCod", "Meilleur buteur", "Erling Haaland"],
  ["MaxouCod", "Meilleur gardien", "Emiliano Martinez"],
  ["MaxouCod", "Meilleur joueur", "Erling Haaland"],
  ["MaxouCod", "Meilleur passeur", "Rayan Cherki"],
  ["MaxouCod", "Meilleure attaque", "Manchester City"],
  ["MaxouCod", "Meilleure défense", "Arsenal"],
  ["Ulysse", "Champion", "Arsenal"],
  ["Ulysse", "Meilleur buteur", "Haaland"],
  ["Ulysse", "Meilleur gardien", "David Raya"],
  ["Ulysse", "Meilleur joueur", "Wirtz"],
  ["Ulysse", "Meilleur passeur", "Wirtz"],
  ["Ulysse", "Meilleure attaque", "Liverpool"],
  ["Ulysse", "Meilleure défense", "Arsenal"],
  ["YNWA", "Champion", "Liverpool"],
  ["YNWA", "Meilleur buteur", "Alexander Isak"],
  ["YNWA", "Meilleur gardien", "Alisson Becker"],
  ["YNWA", "Meilleur joueur", "Szoboszlai"],
  ["YNWA", "Meilleur passeur", "Wirtz"],
  ["YNWA", "Meilleure attaque", "Liverpool"],
  ["YNWA", "Meilleure défense", "Liverpool"],
  ["Zito", "Champion", "Arsenal"],
  ["Zito", "Meilleur buteur", "Erling Haaland"],
  ["Zito", "Meilleur gardien", "David Raya"],
  ["Zito", "Meilleur joueur", "Erling Haaland"],
  ["Zito", "Meilleur passeur", "Rayan Cherki"],
  ["Zito", "Meilleure attaque", "Manchester City"],
  ["Zito", "Meilleure défense", "Arsenal"],
];

const categories = [
  "Champion",
  "Meilleur buteur",
  "Meilleur gardien",
  "Meilleur joueur",
  "Meilleur passeur",
  "Meilleure attaque",
  "Meilleure défense",
];

const bonusPointValues = {
  Champion: 10,
  "Meilleur buteur": 3,
  "Meilleur gardien": 3,
  "Meilleur joueur": 3,
  "Meilleur passeur": 3,
  "Meilleure attaque": 5,
  "Meilleure défense": 5,
};

const playerCategories = new Set([
  "Meilleur buteur",
  "Meilleur gardien",
  "Meilleur joueur",
  "Meilleur passeur",
]);

const players = [...new Set(bonusRows.map(([player]) => player))].sort((a, b) => a.localeCompare(b, "fr"));

const defaultState = {
  official: Object.fromEntries(categories.map((category) => [category, ""])),
  points: Object.fromEntries(players.map((player) => [player, { bonus: 0, pronostics: 0 }])),
  currentRound: "",
  currentRoundStatus: "complete",
  history: [],
};

let state = loadState();

const els = {
  accessGate: document.querySelector("#accessGate"),
  accessForm: document.querySelector("#accessForm"),
  accessName: document.querySelector("#adminName"),
  accessPassword: document.querySelector("#adminPassword"),
  accessError: document.querySelector("#accessError"),
  appShell: document.querySelector("#appShell"),
  logoutBtn: document.querySelector("#logoutBtn"),
  leaderName: document.querySelector("#leaderName"),
  dayWinnerName: document.querySelector("#dayWinnerName"),
  tabs: document.querySelectorAll("[data-tab]"),
  panels: document.querySelectorAll("[data-panel]"),
  bonusBody: document.querySelector("#bonusBody"),
  bonusCount: document.querySelector("#bonusCount"),
  rankingBody: document.querySelector("#rankingBody"),
  evolutionChart: document.querySelector("#evolutionChart"),
  officialForm: document.querySelector("#officialForm"),
  adminPointsBody: document.querySelector("#adminPointsBody"),
  roundHistoryBody: document.querySelector("#roundHistoryBody"),
  roundInput: document.querySelector("#roundInput"),
  roundStatus: document.querySelector("#roundStatus"),
  saveAdminBtn: document.querySelector("#saveAdminBtn"),
  resetAdminBtn: document.querySelector("#resetAdminBtn"),
  adminStatus: document.querySelector("#adminStatus"),
};

els.accessForm.addEventListener("submit", handleAccessSubmit);
els.logoutBtn.addEventListener("click", lockSite);
els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.dataset.tab));
});
els.saveAdminBtn.addEventListener("click", saveAdminValues);
els.resetAdminBtn.addEventListener("click", resetAdminValues);
els.roundHistoryBody.addEventListener("click", handleRoundHistoryClick);

if (sessionStorage.getItem(accessKey) === "ok") {
  unlockSite();
} else {
  lockSite();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "null");
    return mergeMiniState(parsed);
  } catch {
    return structuredClone(defaultState);
  }
}

function mergeMiniState(saved) {
  const next = structuredClone(defaultState);
  if (!saved || typeof saved !== "object") return next;

  categories.forEach((category) => {
    if (typeof saved.official?.[category] === "string") {
      next.official[category] = saved.official[category];
    }
  });

  players.forEach((player) => {
    const savedPoints = saved.points?.[player];
    if (!savedPoints || typeof savedPoints !== "object") return;
    next.points[player].pronostics = numberOrZero(savedPoints.pronostics);
  });

  next.currentRound = saved.currentRound ? String(saved.currentRound) : "";
  next.currentRoundStatus = saved.currentRoundStatus === "incomplete" ? "incomplete" : "complete";
  next.history = normalizeHistory(saved.history);

  return next;
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

async function syncFromRemote() {
  try {
    els.adminStatus.textContent = "Lecture Supabase...";
    const response = await fetch("/api/state", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || payload.error || "Lecture impossible");

    state = mergeMiniState(payload.state?.[remoteStateKey]);
    persist();
    render();
    els.adminStatus.textContent = "Données Supabase chargées.";
  } catch (error) {
    els.adminStatus.textContent = `Synchro impossible: ${error.message}`;
  }
}

async function saveToRemote() {
  persist();
  const response = await fetch("/api/state", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ state: { [remoteStateKey]: state } }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.detail || payload.error || "Sauvegarde impossible");
  state = mergeMiniState(payload.state?.[remoteStateKey]);
  persist();
}

function render() {
  renderHeader();
  renderBonusTable();
  renderRanking();
  renderEvolution();
  renderAdmin();
}

function renderHeader() {
  const leader = currentRankingRows()[0];
  const dayWinner = latestDayWinner();
  els.leaderName.textContent = leader ? `${leader.player} (${leader.total} pts)` : "-";
  els.dayWinnerName.textContent = dayWinner || "-";
}

function handleAccessSubmit(event) {
  event.preventDefault();
  const nameOk = normalize(els.accessName.value) === adminName;
  const passwordOk = els.accessPassword.value === adminPassword;

  if (!nameOk || !passwordOk) {
    els.accessError.hidden = false;
    els.accessPassword.value = "";
    els.accessPassword.focus();
    return;
  }

  sessionStorage.setItem(accessKey, "ok");
  unlockSite();
}

function unlockSite() {
  els.accessGate.hidden = true;
  els.appShell.hidden = false;
  els.accessError.hidden = true;
  render();
  syncFromRemote();
}

function lockSite() {
  sessionStorage.removeItem(accessKey);
  els.accessGate.hidden = false;
  els.appShell.hidden = true;
  els.accessPassword.value = "";
  els.accessName.value = "";
  els.accessName.focus();
}

function setTab(name) {
  els.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === name));
  els.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));
}

function renderBonusTable() {
  els.bonusBody.innerHTML = "";
  els.bonusCount.textContent = `${bonusRows.length} choix`;

  bonusRows.forEach(([player, category, choice], index) => {
    const previousPlayer = bonusRows[index - 1]?.[0];
    const official = state.official[category] || "";
    const points = pointsForBonusChoice(category, choice, official);
    const row = document.createElement("tr");
    if (player !== previousPlayer) row.classList.add("player-start");
    row.innerHTML = `
      <td>${escapeHtml(player)}</td>
      <td>${escapeHtml(category)}</td>
      <td>${escapeHtml(choice)}</td>
      <td>${official ? escapeHtml(official) : '<span class="muted">-</span>'}</td>
      <td><strong>${points}</strong></td>
    `;
    els.bonusBody.append(row);
  });
}

function renderRanking() {
  els.rankingBody.innerHTML = "";
  const rows = currentRankingRows();

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="rank">${index + 1}</span></td>
      <td>${escapeHtml(row.player)}</td>
      <td>${row.bonus}</td>
      <td>${row.pronostics}</td>
      <td><strong>${row.total}</strong></td>
    `;
    els.rankingBody.append(tr);
  });
}

function renderEvolution() {
  if (!state.history.length) {
    els.evolutionChart.innerHTML = "";
    return;
  }

  const orderedHistory = [...state.history].sort((a, b) => a.round - b.round);
  const maxTotal = Math.max(1, ...orderedHistory.flatMap((entry) => players.map((player) => numberOrZero(entry.totals?.[player]))));
  const width = Math.max(520, orderedHistory.length * 92);
  const height = 280;
  const padding = { left: 44, right: 16, top: 20, bottom: 34 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const xFor = (index) => padding.left + (orderedHistory.length === 1 ? plotWidth / 2 : (index / (orderedHistory.length - 1)) * plotWidth);
  const yFor = (value) => padding.top + plotHeight - (numberOrZero(value) / maxTotal) * plotHeight;
  const colors = ["#1f6b43", "#bd4d40", "#d99a2b", "#3d6fb6", "#7b4ab8", "#1f8a8a", "#8b5a2b", "#5f6b2f"];

  const gridLines = [0, Math.ceil(maxTotal / 2), maxTotal].map((value) => {
    const y = yFor(value);
    return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid" /><text x="8" y="${y + 4}" class="chart-label">${value}</text>`;
  }).join("");
  const dayLabels = orderedHistory.map((entry, index) => `<text x="${xFor(index)}" y="${height - 10}" class="chart-label chart-day">J${entry.round}</text>`).join("");
  const playerLines = players.map((player, playerIndex) => {
    const color = colors[playerIndex % colors.length];
    const points = orderedHistory.map((entry, index) => `${xFor(index)},${yFor(entry.totals?.[player])}`).join(" ");
    const dots = orderedHistory.map((entry, index) => {
      const total = numberOrZero(entry.totals?.[player]);
      return `<circle cx="${xFor(index)}" cy="${yFor(total)}" r="3" fill="${color}"><title>${escapeHtml(player)} J${entry.round}: ${total} pts</title></circle>`;
    }).join("");
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.4" />${dots}`;
  }).join("");
  const legend = players.map((player, index) => `<span class="legend-item"><span style="background:${colors[index % colors.length]}"></span>${escapeHtml(player)}</span>`).join("");

  els.evolutionChart.innerHTML = `
    <div class="chart-scroller">
      <svg class="evolution-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Évolution du classement par journée">
        ${gridLines}
        ${dayLabels}
        ${playerLines}
      </svg>
    </div>
    <div class="chart-legend">${legend}</div>
  `;
}

function renderAdmin() {
  els.roundInput.value = state.currentRound || "";
  els.roundStatus.value = state.currentRoundStatus || "complete";
  renderRoundHistory();
  els.officialForm.innerHTML = "";
  categories.forEach((category) => {
    const label = document.createElement("label");
    label.innerHTML = `
      <span>${escapeHtml(category)}</span>
      <input data-official="${escapeHtml(category)}" value="${escapeHtml(state.official[category] || "")}" placeholder="Réponse officielle" />
    `;
    els.officialForm.append(label);
  });

  els.adminPointsBody.innerHTML = "";
  players.forEach((player) => {
    const points = state.points[player] || { bonus: 0, pronostics: 0 };
    const automaticBonus = bonusPointsFor(player);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(player)}</td>
      <td><strong>${automaticBonus}</strong></td>
      <td><input type="number" min="0" step="1" data-points="pronostics" data-player="${escapeHtml(player)}" value="${points.pronostics}" /></td>
    `;
    els.adminPointsBody.append(row);
  });
}

function renderRoundHistory() {
  const history = normalizeHistory(state.history);
  if (!history.length) {
    els.roundHistoryBody.innerHTML = `
      <tr>
        <td colspan="4" class="muted">Aucune journée enregistrée.</td>
      </tr>
    `;
    return;
  }

  els.roundHistoryBody.innerHTML = history.map((entry, index) => {
    const winner = dayWinnerForEntry(history, index);
    return `
      <tr>
        <td>J${entry.round}</td>
        <td>${entry.complete ? "Complète" : "Incomplète"}</td>
        <td>${entry.complete ? escapeHtml(winner || "-") : "Pas encore"}</td>
        <td><button class="mini-button" type="button" data-load-round="${entry.round}">Reprendre</button></td>
      </tr>
    `;
  }).join("");
}

function handleRoundHistoryClick(event) {
  const button = event.target.closest("[data-load-round]");
  if (!button) return;
  const round = numberOrZero(button.dataset.loadRound);
  const entry = normalizeHistory(state.history).find((item) => item.round === round);
  if (!entry) return;

  state.currentRound = String(entry.round);
  state.currentRoundStatus = entry.complete ? "complete" : "incomplete";
  players.forEach((player) => {
    if (!state.points[player]) state.points[player] = { bonus: 0, pronostics: 0 };
    state.points[player].pronostics = numberOrZero(entry.pronostics?.[player]);
  });
  renderAdmin();
  els.adminStatus.textContent = `Journée ${entry.round} reprise. Modifie si besoin, puis clique sur Enregistrer.`;
}

async function saveAdminValues() {
  document.querySelectorAll("[data-official]").forEach((input) => {
    state.official[input.dataset.official] = input.value.trim();
  });

  document.querySelectorAll("[data-points='pronostics']").forEach((input) => {
    const player = input.dataset.player;
    if (!state.points[player]) state.points[player] = { bonus: 0, pronostics: 0 };
    state.points[player].pronostics = numberOrZero(input.value);
  });
  state.currentRound = els.roundInput.value.trim();
  state.currentRoundStatus = els.roundStatus.value === "incomplete" ? "incomplete" : "complete";
  recordRoundSnapshot();

  render();
  els.adminStatus.textContent = "Sauvegarde Supabase...";
  try {
    await saveToRemote();
    render();
    els.adminStatus.textContent = "Enregistré dans Supabase.";
  } catch (error) {
    els.adminStatus.textContent = `Erreur synchro: ${error.message}`;
  }
}

async function resetAdminValues() {
  if (!confirm("Remettre à zéro les réponses officielles et les points ?")) return;
  state = structuredClone(defaultState);
  render();
  els.adminStatus.textContent = "Remise à zéro Supabase...";
  try {
    await saveToRemote();
    render();
    els.adminStatus.textContent = "Remis à zéro dans Supabase.";
  } catch (error) {
    els.adminStatus.textContent = `Erreur synchro: ${error.message}`;
  }
}

function currentRankingRows() {
  return players
    .map((player) => {
      const points = state.points[player] || { bonus: 0, pronostics: 0 };
      return {
        player,
        bonus: bonusPointsFor(player),
        pronostics: numberOrZero(points.pronostics),
      };
    })
    .map((row) => ({ ...row, total: row.bonus + row.pronostics }))
    .sort((a, b) => b.total - a.total || b.bonus - a.bonus || a.player.localeCompare(b.player, "fr"));
}

function recordRoundSnapshot() {
  const round = numberOrZero(state.currentRound);
  if (!round) return;
  const rows = currentRankingRows();
  const totals = Object.fromEntries(rows.map((row) => [row.player, row.total]));
  const pronostics = Object.fromEntries(rows.map((row) => [row.player, row.pronostics]));
  const nextEntry = {
    round,
    complete: state.currentRoundStatus !== "incomplete",
    totals,
    pronostics,
    savedAt: new Date().toISOString(),
  };
  state.history = [
    ...normalizeHistory(state.history).filter((entry) => entry.round !== round),
    nextEntry,
  ].sort((a, b) => a.round - b.round);
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .map((entry) => ({
      round: numberOrZero(entry?.round),
      totals: players.reduce((totals, player) => {
        totals[player] = numberOrZero(entry?.totals?.[player]);
        return totals;
      }, {}),
      pronostics: players.reduce((pronostics, player) => {
        pronostics[player] = numberOrZero(entry?.pronostics?.[player]);
        return pronostics;
      }, {}),
      complete: entry?.complete !== false,
      savedAt: typeof entry?.savedAt === "string" ? entry.savedAt : "",
    }))
    .filter((entry) => entry.round > 0)
    .sort((a, b) => a.round - b.round);
}

function latestDayWinner() {
  const orderedHistory = normalizeHistory(state.history);
  if (!orderedHistory.length) return "";
  const latest = [...orderedHistory].reverse().find((entry) => entry.complete);
  if (!latest) return "";
  const latestIndex = orderedHistory.findIndex((entry) => entry.round === latest.round);
  const winner = dayWinnerForEntry(orderedHistory, latestIndex);
  return winner ? `J${latest.round}: ${winner}` : "";
}

function dayWinnerForEntry(orderedHistory, latestIndex) {
  const latest = orderedHistory[latestIndex];
  if (!latest?.complete) return "";
  const previous = latestIndex > 0 ? orderedHistory[latestIndex - 1] : null;
  const scores = players.map((player) => ({
    player,
    points: numberOrZero(latest.pronostics?.[player]) - numberOrZero(previous?.pronostics?.[player]),
  }));
  const best = Math.max(0, ...scores.map((score) => score.points));
  if (!best) return "";
  const rankingOrder = new Map(currentRankingRows().map((row, index) => [row.player, index]));
  const winner = scores
    .filter((score) => score.points === best)
    .sort((a, b) => (rankingOrder.get(a.player) ?? 999) - (rankingOrder.get(b.player) ?? 999))[0];
  return `${winner.player} (${best} pts)`;
}

function officialMatchesFor(player) {
  return bonusRows
    .filter(([rowPlayer]) => rowPlayer === player)
    .filter(([, category, choice]) => same(choice, state.official[category], category))
    .length;
}

function bonusPointsFor(player) {
  return bonusRows
    .filter(([rowPlayer]) => rowPlayer === player)
    .reduce((total, [, category, choice]) => {
      return total + pointsForBonusChoice(category, choice, state.official[category]);
    }, 0);
}

function pointsForBonusChoice(category, choice, official) {
  if (!same(choice, official, category)) return 0;
  return bonusPointValues[category] || 0;
}

function same(a, b, category) {
  const left = comparableValue(a, category);
  const right = comparableValue(b, category);
  if (!left || !right) return false;
  if (left === right) return true;

  const shortest = left.length <= right.length ? left : right;
  const longest = left.length > right.length ? left : right;
  return shortest.length >= 4 && longest.includes(shortest);
}

function comparableValue(value, category) {
  const normalized = normalize(value);
  if (!playerCategories.has(category)) return normalized;
  const parts = normalized.split(/\s+-\s+|\s+\/\s+|\s+,\s+/).filter(Boolean);
  return parts.at(-1) || normalized;
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number) : 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}
