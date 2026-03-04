function dragActiver(zone, options) {
  if (!zone) return;

  var enCours = null;

  zone.addEventListener('dragstart', function (e) {
    var carte = e.target.closest('[data-carte]');
    if (!carte) return;

    enCours = {
      carteId: carte.dataset.carte,
      sourceColId: carte.dataset.col
    };

    carte.style.opacity = '0.4';
  });

  zone.addEventListener('dragend', function (e) {
    var carte = e.target.closest('[data-carte]');
    if (carte) carte.style.opacity = '1';
    enCours = null;

    document.querySelectorAll('.drag-over').forEach(function (el) {
      el.classList.remove('drag-over');
    });
  });

  zone.addEventListener('dragover', function (e) {
    var target = e.target.closest('[data-drop-zone]');
    if (!target || !enCours) return;

    e.preventDefault();
    target.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', function (e) {
    var target = e.target.closest('[data-drop-zone]');
    if (target) target.classList.remove('drag-over');
  });

  zone.addEventListener('drop', function (e) {
    var target = e.target.closest('[data-drop-zone]');
    if (!target || !enCours) return;

    e.preventDefault();

    document.querySelectorAll('.drag-over').forEach(function (el) {
      el.classList.remove('drag-over');
    });

    if (typeof options.onDrop === 'function') {
      options.onDrop({
        carteId: enCours.carteId,
        sourceColId: enCours.sourceColId,
        cibleColId: target.dataset.dropZone
      });
    }
  });
}
