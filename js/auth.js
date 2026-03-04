var CLES = {
  users: 'tf_users',
  session: 'tf_session',
  boards: 'tf_boards_'
};

function lireValeur(id) {
  var el = document.getElementById(id);
  return el ? el.value : '';
}

function afficherErreur(id, message) {
  var el = document.getElementById(id);
  if (el) el.textContent = message;
}

function afficherMessage(id, message) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
}

function nettoyerMessages() {
  var msgErreur = document.getElementById('msgErreur');
  var msgSucces = document.getElementById('msgSucces');

  if (msgErreur) msgErreur.style.display = 'none';
  if (msgSucces) msgSucces.style.display = 'none';

  document.querySelectorAll('.err').forEach(function (e) {
    e.textContent = '';
  });
}

function creerId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

function lireUsers() {
  return JSON.parse(localStorage.getItem(CLES.users) || '[]');
}

function sauverUsers(users) {
  localStorage.setItem(CLES.users, JSON.stringify(users));
}

function lireSession() {
  var raw = localStorage.getItem(CLES.session);
  return raw ? JSON.parse(raw) : null;
}

function definirSession(session) {
  localStorage.setItem(CLES.session, JSON.stringify(session));
}

function supprimerSession() {
  localStorage.removeItem(CLES.session);
}

function forcerSession() {
  var session = lireSession();

  if (!session && location.pathname.includes('/pages/')) {
    location.href = 'login.html';
    return null;
  }

  return session;
}

function deconnexion() {
  supprimerSession();
  location.href = 'login.html';
}
