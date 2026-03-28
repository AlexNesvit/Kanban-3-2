# Guide de déploiement

## 1. Déploiement avec Docker (image de production)

### Prérequis
- Docker installé
- Variables d'environnement prêtes (`.env`)

Exemple minimal de `.env` pour Docker local :
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://host.docker.internal:27017/kanban
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Construire l'image
```bash
docker build -t kanban-api:latest .
```

### Lancer le conteneur API
```bash
docker run --rm -p 3000:3000 --env-file .env kanban-api:latest
```

### Vérification
```bash
curl http://localhost:3000/health
```
Réponse attendue : statut HTTP `200` avec un JSON contenant `status: "ok"`.

## 2. Optionnel: exécution avec Docker Compose (API + MongoDB)

Le fichier `docker-compose.yml` démarre :
- `api` (application Node.js)
- `mongo` (MongoDB 7)

### Connexion MongoDB en mode Compose
`docker-compose.yml` force automatiquement `MONGODB_URI=mongodb://mongo:27017/kanban` pour le service API.

### Démarrer la stack
```bash
docker compose up -d --build
```

### Vérifier l'état
```bash
docker compose ps
curl http://localhost:3000/health
```

### Arrêter la stack
```bash
docker compose down
```
