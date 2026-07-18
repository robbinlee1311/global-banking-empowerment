const SESSION_KEY = "gbe_session";
const USER_KEY = "gbe_user";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const admin = { name: "Morgan Ellis", email: "admin@gbe.example", role: "admin" };
const defaultUser = { name: "Avery Johnson", email: "avery@example.com", account: "7429130864", checking: 24850.72, savings: 68420.15, status: "Active", risk: "Low" };
const pendingUsers = [
  ["Nia Carter", "nia@example.com", "KYC Review", "$12,000", "Medium"],
  ["Luis Moreno", "luis@example.com", "Pending Approval", "$4,500", "Low"],
  ["Priya Shah", "priya@example.com", "Enhanced Due Diligence", "$48,300", "High"]
];
function qs(id) { return document.getElementById(id); }
function show(id, text) { const el = qs(id); if (!el) return; el.textContent = text; el.classList.add("show"); }
function session() { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
function setAdminSession() { localStorage.setItem(SESSION_KEY, JSON.stringify({ role: "admin", name: admin.name, email: admin.email, signedInAt: new Date().toISOString() })); }
function loadUser() { return JSON.parse(localStorage.getItem(USER_KEY) || "null") || defaultUser; }
function requireAdmin() { const current = session(); if (!current || current.role !== "admin") { location.replace("index.html"); return false; } return true; }
function logout() { localStorage.removeItem(SESSION_KEY); location.href = "../index.html"; }
function hydrateAdmin() {
  if (document.body.dataset.role === "admin" && !requireAdmin()) return;
  const user = loadUser();
  document.querySelectorAll("[data-admin-name]").forEach(el => el.textContent = admin.name);
  const adminRows = qs("admin-users");
  if (adminRows) adminRows.innerHTML = [user, ...pendingUsers.map(p => ({ name: p[0], email: p[1], status: p[2], opening: p[3], risk: p[4] }))].map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.status || "Active"}</td><td>${u.opening || money.format((u.checking || 0) + (u.savings || 0))}</td><td><span class="badge ${u.risk === "High" ? "danger" : u.risk === "Medium" ? "warn" : "ok"}">${u.risk || "Low"}</span></td><td><button class="btn outline" type="button">Review</button></td></tr>`).join("");
}
function adminLogin() {
  const email = qs("email").value.trim().toLowerCase();
  const password = qs("password").value;
  if (email !== admin.email || password.length < 6) return show("notice", "Use admin@gbe.example and any 6+ character password for this demo.");
  setAdminSession();
  location.href = "dashboard.html";
}
function adminAction(message) { show("notice", message); }
window.adminBank = { adminLogin, logout, adminAction };
document.addEventListener("DOMContentLoaded", hydrateAdmin);
