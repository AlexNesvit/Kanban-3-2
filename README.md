# Étude de cas KANBAN – Bloc 3 (CDA)

## 1. Présentation du projet et contexte
Ce dépôt contient la mise en production progressive d’une API Kanban Node.js/TypeScript (Express + MongoDB) dans le cadre de l’épreuve **Bloc 3 – Préparer le déploiement d’une application sécurisée**.

Objectif global : livrer une API fiable, testée, conteneurisable, sécurisée et documentée pour un redémarrage autonome par un tiers.

## 2. Synthèse des 7 étapes réalisées
1. **Analyse technique** : structure, risques et priorités documentés dans `ANALYSE_EXISTANT.md`.
2. **Tests d’intégration** : tests Vitest/Supertest pour `GET /api/columns` et `POST /api/columns` dans `tests/columns.routes.ts`.
3. **Conteneurisation** : image de production via `Dockerfile` (+ `docker-compose.yml` optionnel).
4. **CI/CD** : stratégie pipeline (push/PR/release, tests/build/déploiement, secrets) dans `CI_CD_STRATEGIE.md`.
5. **Documentation déploiement** : procédure locale + Docker + mise à jour dans `DEPLOYMENT_GUIDE.md`.
6. **Sécurisation** : middleware actif `helmet` + `express-rate-limit` dans `src/middlewares/security.middleware.ts`, branché dans `src/app.ts`.
7. **Synthèse livraison** : dépôt structuré, livrables centralisés et README final.

## 3. Structure du dépôt
```text
src/
  config/          # env, db, logger
  controllers/     # logique routes OF/Column
  middlewares/     # auth, validation, erreurs, sécurité
  models/          # User, Column, OF
  routes/          # auth/ofs/columns
tests/             # tests Vitest + Supertest
Dockerfile
docker-compose.yml
README.md
ANALYSE_EXISTANT.md
CI_CD_STRATEGIE.md
DEPLOYMENT_GUIDE.md
NOTE_SECURITE.md
```

## 4. Installation et exécution
### Prérequis
- Node.js **20**
- npm
- MongoDB (si exécution locale sans Docker)
- Docker + Docker Compose (si exécution conteneurisée)

### Variables d’environnement (`.env`)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kanban
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

### Lancement local
```bash
npm ci
npm run dev
```

### Build production
```bash
npm run build
npm start
```

### Lancement Docker
```bash
docker build -t kanban-api:latest .
docker run --rm -p 3000:3000 --env-file .env kanban-api:latest
```

### Lancement Docker Compose (API + MongoDB)
```bash
docker compose up -d --build
```

Santé API :
```bash
curl http://localhost:3000/health
```

## 5. Tests et qualité
```bash
npm test
npm test -- --watch
npm run test:coverage
```

Les tests d’intégration utilisent MongoDB Memory Server.

## 6. Choix techniques et mesures de sécurité
### Choix techniques
- **TypeScript + Express 5** pour robustesse et maintenabilité.
- **Mongoose** pour la couche d’accès MongoDB.
- **Vitest + Supertest** pour les tests d’intégration API.
- **Docker multi-stage** pour une image production plus propre.

### Mesures de sécurité
- Authentification JWT sur routes métiers (`/api/columns`, `/api/ofs`).
- Validation d’entrée avec Zod.
- Middleware sécurité actif :
  - `helmet` (durcissement des en-têtes HTTP)
  - `express-rate-limit` (limitation du débit sur `/api`)
- Vérification fonctionnelle : route protégée retourne `401` sans token.

Détails : `NOTE_SECURITE.md`.

## 7. Livrables du dépôt
- `ANALYSE_EXISTANT.md`
- `tests/columns.routes.ts`
- `Dockerfile`
- `docker-compose.yml`
- `CI_CD_STRATEGIE.md`
- `DEPLOYMENT_GUIDE.md`
- `NOTE_SECURITE.md`
- `README.md` (ce fichier)


## 8. Remarque dépôt Git
Le dossier `node_modules/` n’est pas versionné (géré par `.gitignore`).
