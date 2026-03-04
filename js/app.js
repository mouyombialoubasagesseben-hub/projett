var state = {
  session: null,
  tableaux: [],
  tableauActifId: ''
};

function getTableauActif() {
  return state.tableaux.find(function (t) {
    return t.id === state.tableauActifId;
  });
}

function saveState() {
  sauvegarderTableaux(state.session.id, state.tableaux);
}

function renderListeTableaux() {
  var box = uiGet('listeTableaux');
  box.innerHTML = '';

  state.tableaux.forEach(function (tableau) {
    var item = document.createElement('div');
    item.className = 'tableau-item' + (tableau.id === state.tableauActifId ? ' actif' : '');

    item.innerHTML =
      '<b class="tableau-nom">' + uiEscape(tableau.nom) + '</b>' +
      '<button class="btn-delete" data-del-tableau="' + tableau.id + '">x</button>';

    item.addEventListener('click', function (e) {
      if (e.target.dataset.delTableau) {
        supprimerTableau(tableau.id);
        return;
      }

      state.tableauActifId = tableau.id;
      render();
    });

    box.appendChild(item);
  });
}

function renderBoard() {
  var zone = uiGet('zoneBoard');
  var tableau = getTableauActif();
  var search = uiGet('recherche').value.trim().toLowerCase();

  if (!tableau) {
    zone.innerHTML = '<p>Aucun tableau disponible.</p>';
    uiGet('titreTableau').textContent = 'Tableau';
    return;
  }

  uiGet('titreTableau').textContent = tableau.nom;

  zone.innerHTML = tableau.colonnes.map(function (col) {
    var cartesFiltrees = col.cartes.filter(function (carte) {
      if (!search) return true;
      var t = carte.titre.toLowerCase();
      var d = (carte.description || '').toLowerCase();
      return t.includes(search) || d.includes(search);
    });

    return uiColonneHtml(col, cartesFiltrees);
  }).join('');
}

function render() {
  renderListeTableaux();
  renderBoard();
  uiGet('sidebar').classList.remove('on');
}

function supprimerTableau(tableauId) {
  if (!confirm('Supprimer ce tableau ?')) return;

  state.tableaux = state.tableaux.filter(function (t) {
    return t.id !== tableauId;
  });

  if (!state.tableaux.length) {
    state.tableaux = tableauParDefaut();
  }

  state.tableauActifId = state.tableaux[0].id;
  saveState();
  render();
  uiToast('Tableau supprime');
}

function supprimerColonne(colId) {
  var tableau = getTableauActif();
  if (!tableau) return;

  if (!confirm('Supprimer cette colonne ?')) return;

  tableau.colonnes = tableau.colonnes.filter(function (c) {
    return c.id !== colId;
  });

  saveState();
  render();
  uiToast('Colonne supprimee');
}

function supprimerCarte(colId, carteId) {
  var tableau = getTableauActif();
  if (!tableau) return;

  var colonne = tableau.colonnes.find(function (c) {
    return c.id === colId;
  });

  if (!colonne) return;

  colonne.cartes = colonne.cartes.filter(function (c) {
    return c.id !== carteId;
  });

  saveState();
  render();
  uiToast('Tache supprimee');
}

function ouvrirModalCarte(colId, carteId) {
  uiGet('erreurTitreCarte').textContent = '';
  uiGet('formCarte').reset();
  uiGet('carteId').value = '';
  uiGet('colonneId').value = colId;
  uiGet('titreModalCarte').textContent = 'Nouvelle tache';

  if (carteId) {
    var tableau = getTableauActif();
    var colonne = tableau && tableau.colonnes.find(function (c) { return c.id === colId; });
    var carte = colonne && colonne.cartes.find(function (c) { return c.id === carteId; });

    if (carte) {
      uiGet('titreModalCarte').textContent = 'Modifier tache';
      uiGet('carteId').value = carte.id;
      uiGet('titreCarte').value = carte.titre;
      uiGet('descCarte').value = carte.description || '';
      uiGet('prioriteCarte').value = carte.priorite || 'moyenne';
      uiGet('dateCarte').value = carte.echeance || '';
    }
  }

  uiModalOuvrir('modalCarte');
}

function deplacerCarte(payload) {
  var tableau = getTableauActif();
  if (!tableau) return;

  var source = tableau.colonnes.find(function (c) { return c.id === payload.sourceColId; });
  var cible = tableau.colonnes.find(function (c) { return c.id === payload.cibleColId; });

  if (!source || !cible) return;

  var idx = source.cartes.findIndex(function (c) { return c.id === payload.carteId; });
  if (idx < 0) return;

  var carte = source.cartes.splice(idx, 1)[0];
  cible.cartes.push(carte);

  saveState();
  renderBoard();
  uiToast('Tache deplacee');
}

function initEvents() {
  uiGet('btnDeconnexion').addEventListener('click', deconnexion);

  uiGet('btnMenu').addEventListener('click', function () {
    uiGet('sidebar').classList.add('on');
  });

  uiGet('btnFermerMenu').addEventListener('click', function () {
    uiGet('sidebar').classList.remove('on');
  });

  uiGet('btnNouveauTableau').addEventListener('click', function () {
    uiGet('erreurNomTableau').textContent = '';
    uiGet('nomTableau').value = '';
    uiModalOuvrir('modalTableau');
  });

  uiGet('btnNouvelleColonne').addEventListener('click', function () {
    uiGet('erreurNomColonne').textContent = '';
    uiGet('nomColonne').value = '';
    uiModalOuvrir('modalColonne');
  });

  uiGet('recherche').addEventListener('input', renderBoard);

  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      uiModalFermer(btn.dataset.close);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) {
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) backdrop.classList.remove('on');
    });
  });

  uiGet('formTableau').addEventListener('submit', function (e) {
    e.preventDefault();

    var nom = uiGet('nomTableau').value.trim();
    if (!nom) {
      uiGet('erreurNomTableau').textContent = 'Nom obligatoire';
      return;
    }

    var tableau = {
      id: creerId(),
      nom: nom,
      colonnes: [
        { id: creerId(), titre: 'A faire', cartes: [] },
        { id: creerId(), titre: 'En cours', cartes: [] },
        { id: creerId(), titre: 'Termine', cartes: [] }
      ]
    };

    state.tableaux.push(tableau);
    state.tableauActifId = tableau.id;
    saveState();

    uiModalFermer('modalTableau');
    render();
    uiToast('Tableau cree');
  });

  uiGet('formColonne').addEventListener('submit', function (e) {
    e.preventDefault();

    var nom = uiGet('nomColonne').value.trim();
    if (!nom) {
      uiGet('erreurNomColonne').textContent = 'Nom obligatoire';
      return;
    }

    var tableau = getTableauActif();
    if (!tableau) return;

    tableau.colonnes.push({ id: creerId(), titre: nom, cartes: [] });
    saveState();

    uiModalFermer('modalColonne');
    render();
    uiToast('Colonne ajoutee');
  });

  uiGet('formCarte').addEventListener('submit', function (e) {
    e.preventDefault();

    var titre = uiGet('titreCarte').value.trim();
    if (!titre) {
      uiGet('erreurTitreCarte').textContent = 'Titre obligatoire';
      return;
    }

    var colId = uiGet('colonneId').value;
    var carteId = uiGet('carteId').value;
    var tableau = getTableauActif();
    if (!tableau) return;

    var colonne = tableau.colonnes.find(function (c) { return c.id === colId; });
    if (!colonne) return;

    if (carteId) {
      var carte = colonne.cartes.find(function (c) { return c.id === carteId; });
      if (carte) {
        carte.titre = titre;
        carte.description = uiGet('descCarte').value.trim();
        carte.priorite = uiGet('prioriteCarte').value;
        carte.echeance = uiGet('dateCarte').value;
      }
    } else {
      colonne.cartes.push({
        id: creerId(),
        titre: titre,
        description: uiGet('descCarte').value.trim(),
        priorite: uiGet('prioriteCarte').value,
        echeance: uiGet('dateCarte').value
      });
    }

    saveState();
    uiModalFermer('modalCarte');
    render();
    uiToast('Tache enregistree');
  });

  uiGet('zoneBoard').addEventListener('click', function (e) {
    var d = e.target.dataset;

    if (d.addCarte) {
      ouvrirModalCarte(d.addCarte, '');
      return;
    }

    if (d.delColonne) {
      supprimerColonne(d.delColonne);
      return;
    }

    if (d.delCarte) {
      supprimerCarte(d.col, d.delCarte);
      return;
    }

    if (d.editCarte) {
      ouvrirModalCarte(d.col, d.editCarte);
    }
  });

  dragActiver(uiGet('zoneBoard'), {
    onDrop: deplacerCarte
  });
}

document.addEventListener('DOMContentLoaded', function () {
  state.session = forcerSession();
  if (!state.session) return;

  uiGet('nomUser').textContent = state.session.nom;
  uiGet('emailUser').textContent = state.session.email;
  uiGet('avatarUser').textContent = state.session.nom
    .split(' ')
    .map(function (m) { return m[0]; })
    .join('')
    .toUpperCase()
    .slice(0, 2);

  state.tableaux = chargerTableaux(state.session.id);
  state.tableauActifId = (state.tableaux[0] || {}).id || '';

  initEvents();
  render();
});
