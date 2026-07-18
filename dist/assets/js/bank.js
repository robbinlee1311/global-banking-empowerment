const KEY = "gbe_user";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const defaultUser = {
  name: "Avery Johnson",
  email: "avery@example.com",
  phone: "+1 202 555 0174",
  account: "7429130864",
  checking: 24850.72,
  savings: 68420.15,
  card: "4821",
  transactions: [
    ["Jul 18", "Payroll deposit", "Checking", 6200, "Completed"],
    ["Jul 17", "Mortgage payment", "Checking", -2180.45, "Completed"],
    ["Jul 16", "Savings transfer", "Savings", 950, "Completed"],
    ["Jul 15", "Card purchase", "Checking", -186.22, "Completed"]
  ]
};
function loadUser() { return JSON.parse(localStorage.getItem(KEY) || "null") || defaultUser; }
function saveUser(user) { localStorage.setItem(KEY, JSON.stringify(user)); }
function acct() { return Math.floor(1000000000 + Math.random() * 9000000000).toString(); }
function qs(id) { return document.getElementById(id); }
function hydrateChrome() {
  const user = loadUser();
  document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = user.name);
  document.querySelectorAll("[data-user-email]").forEach(el => el.textContent = user.email);
  document.querySelectorAll("[data-account]").forEach(el => el.textContent = user.account);
  document.querySelectorAll("[data-checking]").forEach(el => el.textContent = money.format(user.checking));
  document.querySelectorAll("[data-savings]").forEach(el => el.textContent = money.format(user.savings));
  document.querySelectorAll("[data-total]").forEach(el => el.textContent = money.format(user.checking + user.savings));
  document.querySelectorAll("[data-card]").forEach(el => el.textContent = user.card);
  const rows = qs("transactions");
  if (rows) rows.innerHTML = user.transactions.map(t => `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td>${money.format(t[3])}</td><td><span class="badge ok">${t[4]}</span></td></tr>`).join("");
}
function register() {
  const name = qs("name").value.trim();
  const email = qs("email").value.trim();
  const phone = qs("phone").value.trim();
  const password = qs("password").value;
  if (!name || !email || !phone || password.length < 6) return show("notice", "Complete all fields. Password needs at least 6 characters.");
  const user = { ...defaultUser, name, email, phone, account: acct(), checking: 2500, savings: 5000, transactions: [["Today", "Opening balance", "Checking", 2500, "Completed"], ["Today", "Savings opening deposit", "Savings", 5000, "Completed"]] };
  saveUser(user);
  location.href = "dashboard.html";
}
function login() {
  const email = qs("email").value.trim();
  if (!email) return show("notice", "Enter your email to continue.");
  const user = loadUser();
  if (email && user.email !== email) user.email = email;
  saveUser(user);
  location.href = "dashboard.html";
}
function transfer() {
  const user = loadUser();
  const amount = Number(qs("amount").value || 0);
  const recipient = qs("recipient").value.trim();
  if (!recipient || amount <= 0) return show("notice", "Enter a recipient and valid amount.");
  if (amount > user.checking) return show("notice", "Amount exceeds available checking balance.");
  user.checking -= amount;
  user.transactions.unshift(["Today", `Transfer to ${recipient}`, "Checking", -amount, "Completed"]);
  saveUser(user);
  show("notice", "Transfer scheduled successfully.");
  hydrateChrome();
}
function show(id, text) { const el = qs(id); if (!el) return; el.textContent = text; el.classList.add("show"); }
window.bank = { register, login, transfer };
document.addEventListener("DOMContentLoaded", hydrateChrome);