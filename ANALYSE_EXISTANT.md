# ANALYSE_EXISTANT

## 1. Structure actuelle du projet
Le projet est une API Node.js/TypeScript basée sur Express 5 et MongoDB (Mongoose), organisée de manière claire par couches :
- `src/config` : configuration environnement (`env.ts`), base de données (`db.ts`), logs (`logger.ts`) ;
- `src/models` : modèles métiers `User`, `Column`, `OF` ;
- `src/middlewares` : authentification JWT, validation Zod, gestion d’erreurs ;
- `src/routes` + `src/controllers` : endpoints `/api/auth`, `/api/columns`, `/api/ofs` ;
- `tests` : Vitest + Supertest + MongoDB Memory Server.

Points structurants positifs : validation d’environnement au démarrage, middleware d’erreur global, authentification JWT déjà intégrée, base TypeScript propre.

## 2. Risques / anomalies constatés
1. **Couverture de tests incomplète sur `api/columns`** : le fichier `tests/columns.test.ts` contient uniquement des cas 401 (sans token), sans tests fonctionnels CRUD authentifiés.
2. **Aucune conteneurisation** : absence de `Dockerfile` et `docker-compose.yml`, donc exécution non reproductible entre environnements.
3. **Aucune CI/CD versionnée** : absence de pipeline (`.github/workflows`), pas d’automatisation build/tests/quality gate.
4. **Risque sécurité configuration** : `CORS_ORIGIN` permissif (`*` par défaut) et secret JWT pouvant être mal géré si `.env` mal contrôlé.
5. **Modélisation OF perfectible** : `columnId` stocké en `string` (et non référence MongoDB) ; risque d’intégrité des relations et de cohérence des déplacements.
6. **Risque opérationnel de logs sensibles** : la connexion DB journalise l’URI complète, potentiellement avec informations sensibles.

## 3. Priorités avant mise en production
### Priorité 1 (bloquant production)
- Compléter les tests d’intégration `api/columns` (GET, POST, PUT, DELETE avec auth + cas d’erreur).
- Mettre en place une CI minimale (lint/build/tests) avec échec bloquant.

### Priorité 2 (stabilité/reproductibilité)
- Ajouter la conteneurisation (`Dockerfile` + `docker-compose`) pour API et base.
- Documenter clairement la procédure de démarrage local et de déploiement.

### Priorité 3 (durcissement sécurité)
- Restreindre CORS par environnement.
- Vérifier la gestion des secrets (pas de fuite `.env`, rotation JWT secret).
- Réduire les logs sensibles (masquage URI/credentials).

### Priorité 4 (qualité technique)
- Faire évoluer `OF.columnId` vers une vraie référence Mongoose (`ObjectId`, `ref: 'Column'`) et ajouter des validations d’intégrité métier.
