function uiGet(id) {
  return document.getElementById(id);
}

function uiToast(message) {
  var toast = uiGet('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('on');

  clearTimeout(uiToast.timer);
  uiToast.timer = setTimeout(function () {
    toast.classList.remove('on');
  }, 1600);
}

function uiModalOuvrir(id) {
  var modal = uiGet(id);
  if (modal) modal.classList.add('on');
}

function uiModalFermer(id) {
  var modal = uiGet(id);
  if (modal) modal.classList.remove('on');
}

function uiEscape(str) {
  return String(str || '').replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

function uiDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr);
  return isNaN(d) ? '' : d.toLocaleDateString('fr-FR');
}

function uiCarteHtml(carte, colId) {
  var desc = carte.description ? '<p>' + uiEscape(carte.description) + '</p>' : '';
  var badgeDate = carte.echeance ? ' - ' + uiDate(carte.echeance) : '';

  return (
    '<article class="carte ' + carte.priorite + '" draggable="true" data-carte="' + carte.id + '" data-col="' + colId + '">' +
      '<h4>' + uiEscape(carte.titre) + '</h4>' +
      desc +
      '<div class="carte-foot">' +
        '<span class="badge">' + uiEscape(carte.priorite) + badgeDate + '</span>' +
        '<span class="carte-actions">' +
          '<button data-edit-carte="' + carte.id + '" data-col="' + colId + '">edit</button>' +
          '<button data-del-carte="' + carte.id + '" data-col="' + colId + '">sup</button>' +
        '</span>' +
      '</div>' +
    '</article>'
  );
}

function uiColonneHtml(colonne, cartes) {
  return (
    '<section class="colonne" data-colonne="' + colonne.id + '">' +
      '<div class="colonne-head">' +
        '<h3>' + uiEscape(colonne.titre) + ' (' + cartes.length + ')</h3>' +
        '<button class="btn-delete" data-del-colonne="' + colonne.id + '">x</button>' +
      '</div>' +
      '<div class="liste-cartes" data-drop-zone="' + colonne.id + '">' +
        cartes.map(function (c) { return uiCarteHtml(c, colonne.id); }).join('') +
      '</div>' +
      '<button class="btn-add-carte" data-add-carte="' + colonne.id + '">+ Ajouter une tache</button>' +
    '</section>'
  );
}
