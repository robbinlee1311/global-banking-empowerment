/* Global Banking Empowerment — Production JavaScript */
(function () {
  "use strict";
  const bank = window.bank = {};

  function requireUser() {
    const user = localStorage.getItem("bank_user");
    if (!user) { location.replace("login.html"); return false; }
    return true;
  }
  bank.requireUser = requireUser;

  function isLoggedIn() { return !!localStorage.getItem("bank_user"); }
  bank.isLoggedIn = isLoggedIn;

  function show(type, message) {
    const notice = document.getElementById("notice");
    if (!notice) return;
    const icon = notice.querySelector(".notice-icon");
    const title = notice.querySelector("h4");
    const body = notice.querySelector("p");
    const icons = {
      success: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
      error: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
      info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    };
    icon.innerHTML = icons[type] || icons.info;
    title.textContent = type === "success" ? "Success" : type === "error" ? "Error" : "Notice";
    body.textContent = message;
    notice.classList.add("show");
    setTimeout(() => notice.classList.remove("show"), 4000);
  }
  bank.show = show;

  bank.cardAction = function(message) { show("success", message); };
  bank.serviceAction = function(message) { show("success", message); };

  bank.downloadStatement = function(period) {
    show("success", "Downloading statement for " + period + "...");
    setTimeout(() => {
      const blob = new Blob(["Statement — " + period + "\n\nAccount: ****4521\nPeriod: " + period + "\n\nTransactions will appear here in production."], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "statement-" + period.replace(/\s/g, "-") + ".txt";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 800);
  };

  bank.submitTransfer = function(form) {
    const to = form.querySelector('[name="to"]')?.value;
    const amount = form.querySelector('[name="amount"]')?.value;
    if (!to || !amount) { show("error", "Please fill in all required fields."); return false; }
    show("success", "Transfer of $" + amount + " to " + to + " initiated.");
    form.reset(); return false;
  };

  bank.login = function(form) {
    const email = form.querySelector('[name="email"]')?.value;
    const password = form.querySelector('[name="password"]')?.value;
    if (!email || !password) { show("error", "Please enter your email and password."); return false; }
    localStorage.setItem("bank_user", JSON.stringify({ email, name: email.split("@")[0] }));
    show("success", "Welcome back! Redirecting...");
    setTimeout(() => location.replace("dashboard.html"), 1200);
    return false;
  };

  bank.logout = function() { localStorage.removeItem("bank_user"); location.replace("login.html"); };

  bank.createAccount = function(form) {
    const name = form.querySelector('[name="name"]')?.value;
    const email = form.querySelector('[name="email"]')?.value;
    const password = form.querySelector('[name="password"]')?.value;
    if (!name || !email || !password) { show("error", "Please complete all fields."); return false; }
    localStorage.setItem("bank_user", JSON.stringify({ email, name }));
    show("success", "Account created! Redirecting...");
    setTimeout(() => location.replace("dashboard.html"), 1200);
    return false;
  };

  function updateNavAuth() {
    const user = localStorage.getItem("bank_user");
    const navCta = document.querySelector('.nav-cta');
    if (navCta && user) { const data = JSON.parse(user); navCta.textContent = data.name || 'Account'; navCta.href = 'dashboard.html'; }
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateNavAuth();
    if (document.body.dataset.role === "user" && !requireUser()) return;
  });
})();