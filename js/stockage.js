function tableauParDefaut() {
  return [
    {
      id: creerId(),
      nom: 'Projet Web Semestre 4',
      colonnes: [
        {
          id: creerId(),
          titre: 'A faire',
          cartes: [
            {
              id: creerId(),
              titre: 'Planifier les pages',
              description: 'Lister accueil, login, register, dashboard, profil.',
              priorite: 'haute',
              echeance: ''
            },
            {
              id: creerId(),
              titre: 'Tester responsive',
              description: 'Verifier rendu mobile et desktop sur les pages principales.',
              priorite: 'moyenne',
              echeance: ''
            }
          ]
        },
        {
          id: creerId(),
          titre: 'En cours',
          cartes: [
            {
              id: creerId(),
              titre: 'Coder le dashboard',
              description: 'Ajouter creation de colonnes et taches + recherche.',
              priorite: 'haute',
              echeance: ''
            }
          ]
        },
        {
          id: creerId(),
          titre: 'Termine',
          cartes: [
            {
              id: creerId(),
              titre: 'Initialiser le projet',
              description: 'Mettre en place la structure css/js/pages.',
              priorite: 'basse',
              echeance: ''
            }
          ]
        }
      ]
    }
  ];
}

function chargerTableaux(userId) {
  var raw = localStorage.getItem(CLES.boards + userId);
  return raw ? JSON.parse(raw) : tableauParDefaut();
}

function sauvegarderTableaux(userId, tableaux) {
  localStorage.setItem(CLES.boards + userId, JSON.stringify(tableaux));
}
