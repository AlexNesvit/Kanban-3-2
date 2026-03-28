# DEPLOYMENT_GUIDE

## 1. Prérequis techniques
- **Node.js 20** (recommandé : `node -v` doit retourner `v20.x`)
- **npm** (installé avec Node)
- **Docker** + **Docker Compose** (pour l’exécution conteneurisée)
- **MongoDB** (locale ou distante) si exécution hors Docker Compose

Variables d’environnement requises (`.env`) :
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kanban
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

## 2. Installation et exécution en local (sans Docker)
1. Installer les dépendances :
```bash
npm ci
```
2. Compiler (optionnel en dev, utile pour valider le build) :
```bash
npm run build
```
3. Démarrer en développement :
```bash
npm run dev
```
4. Démarrer en mode production local :
```bash
npm start
```

Vérification rapide :
```bash
curl http://localhost:3000/health
```

## 3. Installation et exécution avec Docker
### Option A: API seule (MongoDB externe)
1. Construire l’image :
```bash
docker build -t kanban-api:latest .
```
2. Lancer le conteneur :
```bash
docker run --rm -p 3000:3000 --env-file .env kanban-api:latest
```

### Option B: API + MongoDB avec Docker Compose
Le projet inclut `docker-compose.yml`.

1. Démarrer les services :
```bash
docker compose up -d --build
```
2. Vérifier l’état :
```bash
docker compose ps
curl http://localhost:3000/health
```
3. Arrêter :
```bash
docker compose down
```

## 4. Commandes de test
- Lancer toute la suite :
```bash
npm test
```
- Mode watch :
```bash
npm test -- --watch
```
- Couverture :
```bash
npm run test:coverage
```

## 5. Procédure de mise à jour simple
### Mise à jour locale
1. Récupérer les changements (`git pull`).
2. Réinstaller proprement les dépendances :
```bash
npm ci
```
3. Revalider le projet :
```bash
npm test
npm run build
```
4. Redémarrer l’application (`npm run dev` ou `npm start`).

### Mise à jour Docker
1. Reconstruire l’image :
```bash
docker build -t kanban-api:latest .
```
2. Si Compose est utilisé :
```bash
docker compose up -d --build
```
3. Vérifier le service :
```bash
curl http://localhost:3000/health
```
