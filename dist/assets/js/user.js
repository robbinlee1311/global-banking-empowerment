const USER_KEY = 'gbe_user';
const SESSION_KEY = 'gbe_session';
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const defaultUser = {
  name: 'Account holder',
  email: '',
  phone: '',
  account: '',
  checking: 0,
  savings: 0,
  card: '',
  status: 'Active',
  transactions: [],
};
function loadUser() {
  return JSON.parse(localStorage.getItem(USER_KEY) || 'null') || defaultUser;
}
function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function setSession(identity) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      role: 'user',
      name: identity.name,
      email: identity.email,
      signedInAt: new Date().toISOString(),
    }),
  );
}
function session() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}
function acct() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
function qs(id) {
  return document.getElementById(id);
}
function show(id, text) {
  const el = qs(id);
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
}
function requireUser() {
  return true;
}
function logout() {
  localStorage.removeItem(SESSION_KEY);
  location.href = 'index.html';
}
function hydrateCustomer() {
  if (document.body.dataset.role === 'user' && !requireUser()) return;
  const user = loadUser();
  document.querySelectorAll('[data-user-name]').forEach((el) => (el.textContent = user.name));
  document.querySelectorAll('[data-user-email]').forEach((el) => (el.textContent = user.email));
  document.querySelectorAll('[data-account]').forEach((el) => (el.textContent = user.account));
  document
    .querySelectorAll('[data-checking]')
    .forEach((el) => (el.textContent = money.format(user.checking)));
  document
    .querySelectorAll('[data-savings]')
    .forEach((el) => (el.textContent = money.format(user.savings)));
  document
    .querySelectorAll('[data-total]')
    .forEach((el) => (el.textContent = money.format(user.checking + user.savings)));
  document.querySelectorAll('[data-card]').forEach((el) => (el.textContent = user.card));
  const rows = qs('transactions');
  if (rows)
    rows.innerHTML = user.transactions.length
      ? user.transactions
          .map(
            (t) =>
              `<tr><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td>${money.format(t[3])}</td><td><span class="badge ok">${t[4]}</span></td></tr>`,
          )
          .join('')
      : `<tr><td colspan="5" class="empty-state">Your completed account activity will appear here.</td></tr>`;
}
function register() {
  const name = qs('name').value.trim();
  const email = qs('email').value.trim();
  const phone = qs('phone').value.trim();
  const password = qs('password').value;
  if (!name || !email || !phone || password.length < 6)
    return show('notice', 'Complete all fields. Password needs at least 6 characters.');
  const user = {
    ...defaultUser,
    name,
    email,
    phone,
    account: acct(),
    status: 'Pending review',
    transactions: [],
  };
  saveUser(user);
  setSession(user);
  location.href = 'dashboard.html';
}
function login() {
  const email = qs('email').value.trim();
  if (!email) return show('notice', 'Enter your email to continue.');
  const user = loadUser();
  if (email && user.email !== email) user.email = email;
  saveUser(user);
  setSession(user);
  location.href = 'dashboard.html';
}
function transfer() {
  const user = loadUser();
  const amount = Number(qs('amount').value || 0);
  const recipient = qs('recipient').value.trim();
  if (!recipient || amount <= 0) return show('notice', 'Enter a recipient and valid amount.');
  if (amount > user.checking) return show('notice', 'Amount exceeds available checking balance.');
  user.checking -= amount;
  user.transactions.unshift([
    'Today',
    `Transfer to ${recipient}`,
    'Checking',
    -amount,
    'Completed',
  ]);
  saveUser(user);
  show('notice', 'Transfer scheduled successfully.');
  hydrateCustomer();
}
function sendSupportMessage() {
  const input = qs('support-message');
  const thread = qs('support-thread');
  if (!input || !thread || !input.value.trim())
    return show('notice', 'Type a message before sending.');
  const text = input.value.trim();
  thread.insertAdjacentHTML(
    'beforeend',
    `<div class="bubble me"><strong>You</strong><p>${text.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</p><span>Just now</span></div><div class="bubble agent"><strong>Customer Care</strong><p>Thanks. A specialist is reviewing this and will respond in the secure message center.</p><span>Just now</span></div>`,
  );
  input.value = '';
}
function cardAction(message) {
  show('notice', message);
}
function downloadStatement(period) {
  const user = loadUser();
  const content = `Global Banking Empowerment\nAccount statement\nPeriod: ${period}\nAccount holder: ${user.name}\nGenerated: ${new Date().toLocaleDateString()}`;
  const file = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = `statement-${period.replace(/\s+/g, '-').toLowerCase()}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}
window.bank = {
  register,
  login,
  transfer,
  logout,
  sendSupportMessage,
  cardAction,
  downloadStatement,
};
document.addEventListener('DOMContentLoaded', hydrateCustomer);
