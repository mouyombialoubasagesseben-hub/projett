# TaskFlow

Application web de gestion de taches type kanban, realisee en HTML, CSS et JavaScript pur.

## Objectif du projet

TaskFlow a ete concu pour un contexte etudiant (Licence 2 Genie Informatique) afin de:
- organiser les taches de cours et de projet;
- suivre l'avancement par colonnes (A faire, En cours, Termine);
- gerer des priorites et des dates d'echeance;
- conserver les donnees localement dans le navigateur.

## Fonctionnalites

- Inscription / connexion / deconnexion
- Gestion de session utilisateur
- Creation de plusieurs tableaux
- Ajout / suppression de colonnes
- Ajout / modification / suppression de taches
- Drag and drop des taches entre colonnes
- Recherche de taches par titre/description
- Page profil (stats + edition du nom + mot de passe)

## Structure du projet

- `index.html`: landing page
- `pages/login.html`: connexion
- `pages/register.html`: inscription
- `pages/dashboard.html`: espace de travail kanban
- `pages/profile.html`: profil utilisateur
- `css/style.css`: styles landing
- `css/auth.css`: styles login/register/profile
- `css/dashboard.css`: styles dashboard
- `js/auth.js`: utilitaires auth/session
- `js/storage.js`: chargement/sauvegarde localStorage
- `js/ui.js`: helpers interface
- `js/dragdrop.js`: moteur drag and drop
- `js/app.js`: logique principale du dashboard

## Lancement

1. Ouvrir le dossier dans VS Code.
2. Lancer un serveur local (ex: Live Server).
3. Ouvrir `index.html`.

## Stockage local

Les donnees sont stockees dans `localStorage` avec les cles:
- `tf_users`
- `tf_session`
- `tf_boards_<id_user>`

## Remarque

Le projet est autonome (aucun backend) et pret pour un hebergement statique (GitHub Pages, Vercel).
