# CI_CD_STRATEGIE

## 1. Objectifs de la CI/CD
La stratégie CI/CD vise à sécuriser la mise en production de l’API Kanban en standardisant les vérifications à chaque changement.
Objectifs principaux :
- **Automatisation** : exécuter automatiquement les contrôles techniques sans dépendre d’actions manuelles.
- **Fiabilité** : détecter tôt les régressions (tests, build, qualité) pour éviter les incidents en production.
- **Qualité** : imposer un niveau minimal avant fusion et déploiement (tests passants, build valide, revue approuvée).

## 2. Déclencheurs du pipeline
Le pipeline doit se lancer sur :
- **push** sur branches actives (`main`, `develop`, `feature/*`) pour feedback rapide ;
- **pull request** vers `main` pour valider avant fusion ;
- **release** (ou tag versionné `v*`) pour déclencher le processus de publication/déploiement.

## 3. Étapes principales
Chaîne standard recommandée :
1. **Installation** : checkout + installation des dépendances (`npm ci`).
2. **Tests** : exécution des tests automatisés (`npm test`).
3. **Build** : compilation TypeScript (`npm run build`) pour vérifier la livrabilité.
4. **Déploiement** : publication image Docker et déploiement vers l’environnement cible (staging/production) si toutes les validations sont vertes.

## 4. Extrait YAML simplifié (GitHub Actions)
```yaml
name: ci
on:
  push:
  pull_request:
  release:
    types: [published]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## 5. Secrets et validations avant production
### Gestion des secrets
- Stocker les secrets uniquement dans le gestionnaire CI (ex. `GitHub Secrets`) : `MONGODB_URI`, `JWT_SECRET`, clé registre Docker, etc.
- Ne jamais versionner de secrets dans le dépôt (`.env` exclu par `.gitignore`).
- Utiliser des secrets distincts par environnement (staging/prod) et rotation périodique.

### Validations pré-production
- Pipeline CI obligatoire au statut **success** avant merge vers `main`.
- Revue de code obligatoire (au moins 1 approbation) avant fusion.
- Déploiement production autorisé uniquement depuis release/tag validé.
- Vérification post-déploiement : endpoint `/health` + rollback prévu en cas d’échec.
