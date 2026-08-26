const accessKey = "novaprono-bonus-access-v1";
const sitePassword = "YNWA";

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

const columns = [
  ["Champion", "Champion"],
  ["Buteur", "Meilleur buteur"],
  ["Gardien", "Meilleur gardien"],
  ["Joueur", "Meilleur joueur"],
  ["Passeur", "Meilleur passeur"],
  ["Attaque", "Meilleure attaque"],
  ["Défense", "Meilleure défense"],
];

const els = {
  accessGate: document.querySelector("#accessGate"),
  accessForm: document.querySelector("#accessForm"),
  password: document.querySelector("#sitePassword"),
  accessError: document.querySelector("#accessError"),
  appShell: document.querySelector("#appShell"),
  logoutBtn: document.querySelector("#logoutBtn"),
  tabs: document.querySelectorAll("[data-tab]"),
  panels: document.querySelectorAll("[data-panel]"),
  bonusBody: document.querySelector("#bonusBody"),
  playerCount: document.querySelector("#playerCount"),
};

els.accessForm.addEventListener("submit", handleAccess);
els.logoutBtn.addEventListener("click", lockSite);
els.tabs.forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.dataset.tab));
});

if (sessionStorage.getItem(accessKey) === "ok") {
  unlockSite();
} else {
  lockSite();
}

function handleAccess(event) {
  event.preventDefault();
  if (els.password.value !== sitePassword) {
    els.accessError.hidden = false;
    els.password.value = "";
    els.password.focus();
    return;
  }
  sessionStorage.setItem(accessKey, "ok");
  unlockSite();
}

function unlockSite() {
  els.accessGate.hidden = true;
  els.appShell.hidden = false;
  els.accessError.hidden = true;
  renderBonusTable();
}

function lockSite() {
  sessionStorage.removeItem(accessKey);
  els.accessGate.hidden = false;
  els.appShell.hidden = true;
  els.password.value = "";
  els.password.focus();
}

function setTab(name) {
  els.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.tab === name));
  els.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === name));
}

function renderBonusTable() {
  const players = [...new Set(bonusRows.map(([player]) => player))].sort((a, b) => a.localeCompare(b, "fr"));
  const choicesByPlayer = Object.fromEntries(players.map((player) => [player, {}]));
  bonusRows.forEach(([player, category, choice]) => {
    choicesByPlayer[player][category] = choice;
  });

  els.playerCount.textContent = `${players.length} joueurs`;
  els.bonusBody.innerHTML = players.map((player) => `
    <tr>
      <td>${escapeHtml(player)}</td>
      ${columns.map(([, category]) => `<td>${escapeHtml(choicesByPlayer[player][category] || "-")}</td>`).join("")}
    </tr>
  `).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
