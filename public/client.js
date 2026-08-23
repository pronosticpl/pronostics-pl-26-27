const storageKey = "novaprono-construction-admin-v1";
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
  tabs: document.querySelectorAll("[data-tab]"),
  panels: document.querySelectorAll("[data-panel]"),
  bonusBody: document.querySelector("#bonusBody"),
  bonusCount: document.querySelector("#bonusCount"),
  rankingBody: document.querySelector("#rankingBody"),
  officialForm: document.querySelector("#officialForm"),
  adminPointsBody: document.querySelector("#adminPointsBody"),
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

if (sessionStorage.getItem(accessKey) === "ok") {
  unlockSite();
} else {
  lockSite();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "null");
    return mergeState(parsed);
  } catch {
    return structuredClone(defaultState);
  }
}

function mergeState(saved) {
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

  return next;
}

function persist() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function render() {
  renderBonusTable();
  renderRanking();
  renderAdmin();
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
    const row = document.createElement("tr");
    if (player !== previousPlayer) row.classList.add("player-start");
    row.innerHTML = `
      <td>${escapeHtml(player)}</td>
      <td>${escapeHtml(category)}</td>
      <td>${escapeHtml(choice)}</td>
    `;
    els.bonusBody.append(row);
  });
}

function renderRanking() {
  els.rankingBody.innerHTML = "";
  const rows = players
    .map((player) => {
      const points = state.points[player] || { bonus: 0, pronostics: 0 };
      return {
        player,
        bonus: bonusPointsFor(player),
        pronostics: numberOrZero(points.pronostics),
        officialCount: officialMatchesFor(player),
      };
    })
    .map((row) => ({ ...row, total: row.bonus + row.pronostics }))
    .sort((a, b) => b.total - a.total || b.bonus - a.bonus || a.player.localeCompare(b.player, "fr"));

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="rank">${index + 1}</span></td>
      <td>${escapeHtml(row.player)}</td>
      <td>${row.bonus}</td>
      <td>${row.pronostics}</td>
      <td>${row.officialCount}/7</td>
      <td><strong>${row.total}</strong></td>
    `;
    els.rankingBody.append(tr);
  });
}

function renderAdmin() {
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

function saveAdminValues() {
  document.querySelectorAll("[data-official]").forEach((input) => {
    state.official[input.dataset.official] = input.value.trim();
  });

  document.querySelectorAll("[data-points='pronostics']").forEach((input) => {
    const player = input.dataset.player;
    if (!state.points[player]) state.points[player] = { bonus: 0, pronostics: 0 };
    state.points[player].pronostics = numberOrZero(input.value);
  });

  persist();
  renderRanking();
  els.adminStatus.textContent = "Enregistré.";
  setTimeout(() => {
    els.adminStatus.textContent = "Les changements restent sauvegardés dans ce navigateur.";
  }, 1800);
}

function resetAdminValues() {
  if (!confirm("Remettre à zéro les réponses officielles et les points ?")) return;
  state = structuredClone(defaultState);
  persist();
  render();
  els.adminStatus.textContent = "Remis à zéro.";
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
      if (!same(choice, state.official[category], category)) return total;
      return total + (bonusPointValues[category] || 0);
    }, 0);
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
