# NOTE_SECURITE

## 1. Risques techniques identifiés
### Risque A: accès non autorisé aux ressources API
Les routes métiers (`/api/columns`, `/api/ofs`) exposent des données et des actions de modification.
Sans authentification, un acteur non légitime pourrait lire/modifier/supprimer des informations.

### Risque B: abus d’API (rafales de requêtes)
Une API publique/interne sans limitation peut subir des rafales (bruteforce, scraping, surcharge).
Conséquences: dégradation de performance, indisponibilité partielle, augmentation du coût d’infrastructure.

## 2. Mesures implémentées
### a) Protection des en-têtes HTTP avec Helmet
- Middleware activé globalement via `securityHeaders`.
- Ajout d’en-têtes de sécurité standards (anti-MIME sniffing, frameguard, etc.).
- Intégration dans `src/app.ts` avant les routes.

### b) Limitation de débit avec express-rate-limit
- Middleware `apiRateLimiter` activé sur le préfixe `/api`.
- Fenêtre: 15 minutes ; limite: 100 requêtes/IP (1000 en environnement `test`).
- Retour HTTP `429` en cas de dépassement.

## 3. Vérification d’accès protégé
Les routes `columns` restent protégées par JWT (`authenticate`).
Sans en-tête `Authorization: Bearer <token>`, la route protégée retourne `401`.
Validation effectuée via le test d’intégration existant sur `GET /api/columns` et `POST /api/columns` sans token.

## 4. Limites et points de vigilance
- `helmet` améliore le hardening HTTP mais ne remplace pas une politique IAM/ACL complète.
- Le rate limiting en mémoire est simple mais non distribué: en multi-instances, privilégier un store partagé (Redis).
- Le projet conserve un CORS permissif par défaut (`*`) en dev ; en production, restreindre explicitement les origines autorisées.
- Le contrôle JWT protège les routes privées, mais nécessite une gestion stricte des secrets (rotation, stockage sécurisé, audit).
