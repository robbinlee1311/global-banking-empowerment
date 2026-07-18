const USER_KEY = "gbe_user";
const SESSION_KEY = "gbe_session";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const defaultUser = {
  name: "Avery Johnson",
  email: "avery@example.com",
  phone: "+1 202 555 0174",
  account: "7429130864",
  checking: 24850.72,
  savings: 68420.15,
  card: "4821",
  status: "Active",
  risk: "Low",
  transactions: [
    ["Jul 18", "Payroll deposit", "Checking", 6200, "Completed"],
    ["Jul 17", "Mortgage payment", "Checking", -2180.45, "Completed"],
    ["Jul 16", "Savings transfer", "Savings", 950, "Completed"],
    ["Jul 15", "Card purchase", "Checking", -186.22, "Completed"]
  ]
};
const admin = { name: "Morgan Ellis", email: "admin@gbe.example", role: "admin" };
const pendingUsers = [
  ["Nia Carter", "nia@example.com", "KYC Review", "$12,000", "Medium"],
  ["Luis Moreno", "luis@example.com", "Pending Approval", "$4,500", "Low"],
  ["Priya Shah", "priya@example.com", "Enhanced Due Diligence", "$48,300", "High"]
];
function loadUser() { return JSON.parse(localStorage.getItem(USER_KEY) || "null") || defaultUser; }
function saveUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function session() { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
function setSession(role, identity) { localStorage.setItem(SESSION_KEY, JSON.stringify({ role, name: identity.name, email: identity.email, signedInAt: new Date().toISOString() })); }
function acct() { return Math.floor(1000000000 + Math.random() * 9000000000).toString(); }
function qs(id) { return document.getElementById(id); }
function show(id, text) { const el = qs(id); if (!el) return; el.textContent = text; el.classList.add("show"); }
function requireRole(role) {
  const current = session();
  if (!current || current.role !== role) {
    location.replace(role === "admin" ? "admin-login.html" : "login.html");
    return false;
  }
  return true;
}
function logout() { localStorage.removeItem(SESSION_KEY); location.href = "index.html"; }
function hydrateChrome() {
  const pageRole = document.body.dataset.role;
  if (pageRole && !requireRole(pageRole)) return;
  const current = session();
  const user = loadUser();
  document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = user.name);
  document.querySelectorAll("[data-user-email]").forEach(el => el.textContent = user.email);
  document.querySelectorAll("[data-account]").forEach(el => el.textContent = user.account);
  document.querySelectorAll("[data-checking]").forEach(el => el.textContent = money.format(user.checking));
  document.querySelectorAll("[data-savings]").forEach(el => el.textContent = money.format(user.savings));
  document.querySelectorAll("[data-total]").forEach(el => el.textContent = money.format(user.checking + user.savings));
  document.querySelectorAll("[data-card]").forEach(el => el.textContent = user.card);
  document.querySelectorAll("[data-session-name]").forEach(el => el.textContent = current ? current.name : "Guest");
  document.querySelectorAll("[data-admin-name]").forEach(el => el.textContent = admin.name);
  const rows = qs("transactions");
  if (rows) rows.innerHTML = user.transactions.map(t => `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td>${money.format(t[3])}</td><td><span class="badge ok">${t[4]}</span></td></tr>`).join("");
  const adminRows = qs("admin-users");
  if (adminRows) adminRows.innerHTML = [user, ...pendingUsers.map(p => ({ name: p[0], email: p[1], status: p[2], opening: p[3], risk: p[4] }))].map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.status || "Active"}</td><td>${u.opening || money.format(user.checking + user.savings)}</td><td><span class="badge ${u.risk === "High" ? "danger" : u.risk === "Medium" ? "warn" : "ok"}">${u.risk || "Low"}</span></td><td><button class="btn outline" type="button">Review</button></td></tr>`).join("");
}
function register() {
  const name = qs("name").value.trim();
  const email = qs("email").value.trim();
  const phone = qs("phone").value.trim();
  const password = qs("password").value;
  if (!name || !email || !phone || password.length < 6) return show("notice", "Complete all fields. Password needs at least 6 characters.");
  const user = { ...defaultUser, name, email, phone, account: acct(), checking: 2500, savings: 5000, status: "Pending admin review", transactions: [["Today", "Opening balance", "Checking", 2500, "Completed"], ["Today", "Savings opening deposit", "Savings", 5000, "Completed"]] };
  saveUser(user);
  setSession("user", user);
  location.href = "dashboard.html";
}
function login() {
  const email = qs("email").value.trim();
  if (!email) return show("notice", "Enter your email to continue.");
  const user = loadUser();
  if (email && user.email !== email) user.email = email;
  saveUser(user);
  setSession("user", user);
  location.href = "dashboard.html";
}
function adminLogin() {
  const email = qs("email").value.trim().toLowerCase();
  const password = qs("password").value;
  if (email !== admin.email || password.length < 6) return show("notice", "Use admin@gbe.example and any 6+ character password for this demo.");
  setSession("admin", admin);
  location.href = "admin-dashboard.html";
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
function adminAction(message) { show("notice", message); }
window.bank = { register, login, adminLogin, transfer, logout, adminAction };
document.addEventListener("DOMContentLoaded", hydrateChrome);
