# EduTrack - Plateforme de Gestion de Formation

**Projet de Fin de Module - UML & Développement Fullstack**

EduTrack est une application web complète destinée aux centres de formation. Elle permet de digitaliser le suivi pédagogique en facilitant l'interaction entre les formateurs et les étudiants.

## Équipe & Rôles
Le projet a été mené en suivant une méthodologie Agile, avec une forte emphase sur la cohérence entre la conception UML et l'implémentation technique.

* **[Ton Prénom]** : **Lead Developer Fullstack**
  * Développement des composants Vue.js, logique métier (API) et pipeline CI/CD.
* **Lucas Debelle** : **Backend Architect**
  * Transposition du modèle UML en architecture de base de données et structure des entités.
* **Soukayna Rafik** : **Project Setup & Analysis**
  * Initialisation de l'environnement technique, définition des routes API et des exigences fonctionnelles.
* **Vanessa Lauransot** : **Documentation & QA**
  * Rédaction de la documentation technique, tests de validation et revue de l'interface utilisateur.

## Fonctionnalités Implémentées

* **Authentification** : JWT, Bcrypt, Middleware de sécurité.
* **CRUD Cours** : Gestion complète des modules de formation.
* **Système de Notation** : Logique métier pour l'ajout et la consultation de notes.
* **Interface Reactive** : Dashboard dynamique selon le rôle (Formateur/Étudiant).
## Stack Technique
Le choix technologique a été validé par l'équipe pour répondre aux contraintes de performance et de maintenabilité.

* **Backend** : Node.js avec Express (API REST).
* **Base de données** : MariaDB (SQL) gérée via l'ORM Sequelize.
* **Frontend** : Vue.js 3 avec Vite et Pinia pour la gestion d'état.
* **Infrastructure** : Docker Compose pour l'environnement de développement.

---

## Guide d'Installation (Déploiement)

L'application est conteneurisée pour faciliter le déploiement.

### Prérequis
* Docker installé.
* Git.

### Procédure de démarrage rapide
1. **Cloner le projet**
   ```bash
   git clone [https://github.com/ccocytus/EduTrack](https://github.com/ccocytus/EduTrack)
   cd EduTrack-Projet
   ```

2. **Lancer l'environnement complet**
   Une seule commande suffit pour lancer la base de données :
   ```bash
   docker compose up -d
   ```

3. **Démarrer les serveurs de développement**
   
   **Terminal 1 (Backend) :**
   ```bash
   cd backend
   npm install && npm start
   ```
   
   **Terminal 2 (Frontend) :**
   ```bash
   cd frontend
   npm install && npm run dev
   ```

L'application sera accessible sur : http://localhost:5173