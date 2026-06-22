# Documentation — Tests d'intégration API Arrimage IFU

> **Périmètre :** tests d'intégration backend uniquement — requêtes HTTP réelles via le client Symfony (`WebTestCase`), base PostgreSQL de test, authentification JWT par cookies.  
> Complète les [tests unitaires](tests-unitaires.md). Les tests E2E frontend et les tests de charge ne sont pas couverts ici.

---

## 1. Vue d'ensemble

| Suite | Outil | Emplacement | Commande | Tests (état actuel) |
|-------|-------|-------------|----------|---------------------|
| **Intégration API** | PHPUnit 13 + BrowserKit | `backend/tests/Integration/` | `composer test:integration` | **37 tests** |

```mermaid
flowchart LR
  subgraph infra [Infrastructure]
    TC[ApiTestCase]
    FX[IntegrationFixtures]
    DB[(PostgreSQL arrimage_ifu_test)]
  end

  subgraph controllers [Contrôleurs testés]
    A[Auth]
    E[Employeur]
    S[Saisie]
    D[Discordances]
    C[Consolidation]
    ST[Stats]
    U[Utilisateurs]
    AU[Audit]
    AC[AccessControl]
  end

  TC --> FX
  FX --> DB
  TC --> controllers
```

### Objectifs

1. Vérifier le **contrat HTTP** des endpoints `/api/*` (statuts, JSON, cookies JWT).
2. Valider les **règles d'accès par rôle** (`access_control` dans `security.yaml`).
3. Exercer les **parcours métier multi-étapes** (saisie → contresaisie → discordance / consolidation).
4. S'appuyer sur une **vraie base PostgreSQL** (transactions, contraintes, `FOR UPDATE` consolidation).

---

## 2. Prérequis

### PostgreSQL

Les tests utilisent une base dédiée **`arrimage_ifu_test`** (suffixe `_test` ajouté automatiquement par Doctrine en `APP_ENV=test`).

Credentials par défaut (`.env.test`) :

```
postgresql://postgres:postgres@127.0.0.1:5432/arrimage_ifu?serverVersion=16&charset=utf8
```

Le schéma est créé automatiquement au premier lancement (`doctrine:database:create` + `doctrine:migrations:migrate`). Si PostgreSQL est indisponible, la suite entière est **skipped**.

### Extensions PHP

Identiques au backend : `pdo_pgsql`, `sodium`, `fileinfo`, `gd` (requis par PhpSpreadsheet pour les exports testés).

---

## 3. Exécution

```bash
cd ../backend
composer test:integration
```

Équivalent :

```bash
php vendor/bin/phpunit --testsuite Integration
```

Un fichier isolé :

```bash
php vendor/bin/phpunit tests/Integration/Controller/SaisieControllerTest.php
```

Suite complète (unitaires + intégration) :

```bash
composer test
```

Variables : `APP_ENV=test` forcé par `phpunit.dist.xml`. JWT et `DATABASE_URL` lus depuis `.env.test`.

---

## 4. Architecture des tests

### 4.1 `ApiTestCase` (`tests/Integration/ApiTestCase.php`)

Classe abstraite commune à tous les tests de contrôleur :

| Méthode | Rôle |
|---------|------|
| `setUp()` | Crée le client HTTP, initialise le schéma (une fois), **truncate + re-seed** |
| `login($username, $password)` | `POST /api/auth/login`, vérifie succès, conserve les cookies JWT |
| `jsonRequest($method, $uri, $body)` | Requête JSON avec en-têtes `Content-Type` / `Accept` |
| `assertJsonSuccess($status)` | Statut HTTP + `success: true` |
| `assertJsonError($code, $status)` | Statut HTTP + `success: false` + code erreur |
| `decodeJsonResponse()` | Parse le corps JSON |

**Isolation :** chaque test repart d'une base vide rechargée via `IntegrationFixtures` (TRUNCATE CASCADE + seed).

### 4.2 `IntegrationFixtures` (`tests/Integration/Fixtures/IntegrationFixtures.php`)

| Donnée | Valeur |
|--------|--------|
| **admin** | `admin` / `admin` |
| **agent1** | `agent1` / `Agent1@2026` |
| **agent2** | `agent2` / `Agent2@2026` |
| **controleur** | `controleur` / `Ctrl@2026` |
| **Employeur principal** | `CNSS001234567` — ENTREPRISE BENINOISE SA |
| **Employeur secondaire** | `CNSS009876543` — SOCIETE GENERALE DU BENIN |

### 4.3 Configuration test spécifique

| Fichier | Effet |
|---------|-------|
| `backend/.env.test` | `DATABASE_URL`, clés JWT, `KERNEL_CLASS` |
| `backend/phpunit.dist.xml` | Suites **Unit** et **Integration** séparées |
| `config/packages/test/rate_limiter.yaml` | Politique `no_limit` sur le login |
| `config/services.yaml` (`when@test`) | Désactive `LoginRateLimitSubscriber` (dizaines de logins par suite) |

---

## 5. Inventaire des tests (37)

### AuthControllerTest — 7 tests

| Test | Endpoint | Vérifie |
|------|----------|---------|
| `testLoginReturnsUserAndSetsCookies` | `POST /api/auth/login` | Utilisateur, cookies `access_token` / `refresh_token` |
| `testLoginRejectsInvalidCredentials` | `POST /api/auth/login` | `INVALID_CREDENTIALS` (401) |
| `testMeRequiresAuthentication` | `GET /api/auth/me` | `UNAUTHORIZED` (401) |
| `testMeReturnsCurrentUser` | `GET /api/auth/me` | Profil authentifié |
| `testLogoutClearsSession` | `POST /api/auth/logout` | Session invalidée |
| `testRefreshRenewsTokens` | `POST /api/auth/refresh` | Renouvellement JWT |
| `testChangePasswordUpdatesCredentials` | `POST /api/auth/change-password` | Nouveau mot de passe utilisable |

### EmployeurControllerTest — 3 tests

| Test | Rôle | Vérifie |
|------|------|---------|
| `testShowReturnsEmployeurForAgent1` | agent1 | `GET /api/employeur/{cnss}` → 200 |
| `testShowReturns404ForUnknownCnss` | agent1 | `CNSS_NOT_FOUND` (404) |
| `testShowForbiddenForAgent2` | agent2 | 403 |

### SaisieControllerTest — 6 tests

| Test | Parcours |
|------|----------|
| `testAgent1CreatesSaisie` | Création saisie IFU (201, statut `SAISIE`) |
| `testAgent1CannotCreateDuplicateCnss` | `DUPLICATE_CNSS` (409) |
| `testAgent2CompletesContresaisie` | Attente + contresaisie concordante, masquage IFU agent1 |
| `testAgent1CorrectsDiscordantIfu` | Contexte correction + PATCH discordance |
| `testMesSaisiesReturnsPaginatedList` | Liste paginée + stats agent |
| `testAgent1CannotAccessContresaisieEndpoint` | 403 sur `/api/saisie/attente/{cnss}` |

### DiscordanceControllerTest — 2 tests

| Test | Vérifie |
|------|---------|
| `testControleurListsDiscordances` | Liste après saisie discordante, `summary`, `fetchedAt` |
| `testAgent1CannotAccessDiscordances` | 403 pour agent1 |

### ConsolidationControllerTest — 4 tests

| Test | Vérifie |
|------|---------|
| `testPreviewReturnsEligibleCount` | Aperçu `count` après concordance |
| `testExportConsolidatesConcordantSaisies` | Export XLSX (headers `Content-Type`, `X-Export-Count`) |
| `testExportReturns422WhenNoData` | `NO_DATA` (422) |
| `testAgent1CannotAccessConsolidation` | 403 |

### StatsControllerTest — 2 tests

| Test | Vérifie |
|------|---------|
| `testAdminGetsGlobalStats` | `summary`, `parAgent`, `parDate` |
| `testControleurCannotAccessStats` | 403 pour contrôleur |

### UtilisateurControllerTest — 6 tests

| Test | Vérifie |
|------|---------|
| `testAdminListsUsers` | Liste paginée + `activeCount` |
| `testAdminListsUserOptions` | Options légères pour filtres |
| `testAdminCreatesUser` | Création + mot de passe temporaire (201) |
| `testAdminUpdatesUser` | PATCH nom/prénom/rôle |
| `testAdminResetsPassword` | Reset + `isFirstConnexion` |
| `testAdminCannotDisableLastAdmin` | `LAST_ADMIN` (409) |

### AuditControllerTest — 3 tests

| Test | Vérifie |
|------|---------|
| `testAdminListsAuditLogsAfterLogin` | Journal paginé, action `LOGIN` |
| `testAdminExportsAuditLogs` | Export XLSX (corps binaire `PK…`) |
| `testAgent1CannotAccessAudit` | 403 |

### AccessControlTest — 4 tests

| Test | Vérifie |
|------|---------|
| `testUnauthenticatedApiReturns401` | `UNAUTHORIZED` sans cookie |
| `testAgent1ForbiddenOnAdminRoutes` | 403 utilisateurs / audit / consolidation |
| `testAgent2ForbiddenOnAgent1Routes` | 403 `POST /api/saisie` |
| `testControleurCanAccessDiscordancesButNotStats` | Accès partiel contrôleur |

---

## 6. Cartographie rôles ↔ endpoints

Alignée sur `backend/config/packages/security.yaml` :

| Endpoint (préfixe) | Rôles autorisés |
|--------------------|-----------------|
| `/api/auth/login`, `/refresh` | Public |
| `/api/auth/me`, `/logout`, `/change-password` | Authentifié |
| `/api/employeur` | `ROLE_AGENT1` |
| `POST /api/saisie` | `ROLE_AGENT1` |
| `/api/saisie/attente`, `/contresaisie` | `ROLE_AGENT2` |
| `/api/saisie/*/correction`, `/mes-saisies` | `ROLE_AGENT1` ou `ROLE_AGENT2` |
| `/api/discordances` | `ROLE_CONTROLEUR`, `ROLE_ADMIN` |
| `/api/consolidation`, `/api/stats`, `/api/audit`, `/api/utilisateurs` | `ROLE_ADMIN` |

---

## 7. Conventions

### Nommage

- Un fichier par contrôleur : `XxxControllerTest.php`.
- Méthodes `test*` décrivant le comportement attendu (`testAgent1CannotCreateDuplicateCnss`).
- Helpers privés pour les parcours longs (`seedDiscordantSaisie`, `createSaisieAsAgent1`).

### Authentification

Les tests passent par le **login HTTP** (cookies JWT), pas par injection de token manuelle — cela valide aussi `AuthController` et `JwtCookieAuthenticator`.

Après un changement d'utilisateur dans le même test, vider le cookie jar :

```php
$this->client->getCookieJar()->clear();
```

### Réponses fichier (XLSX)

- **Consolidation** : `BinaryFileResponse` — vérifier les en-têtes (`Content-Type`, `X-Export-Count`, `Content-Disposition`), pas le corps via `getContent()`.
- **Audit export** : `Response` binaire — le corps commence par `PK` (ZIP/XLSX).

---

## 8. Dépannage

| Problème | Cause | Solution |
|----------|-------|----------|
| Suite skipped « Base PostgreSQL indisponible » | PostgreSQL arrêté ou mauvais credentials | Démarrer PostgreSQL, vérifier `.env.test` |
| `RATE_LIMIT` (429) sur login | Cache rate limiter ou subscriber actif | Vérifier `when@test` dans `services.yaml`, supprimer `var/cache/test` |
| Échec consolidation / `FOR UPDATE` | Pas PostgreSQL (SQLite) | Utiliser obligatoirement PostgreSQL |
| Tests flaky sur dates | Fuseau horaire | Les tests n'assertent pas sur des timestamps absolus |
| `Class … not found` (BrowserKit) | Dépendances dev manquantes | `composer install` (symfony/test-pack / browser-kit) |

---

## 9. Périmètre non couvert

| Type | Statut | Piste |
|------|--------|-------|
| **Tests unitaires** | ✅ 63 tests | [tests-unitaires.md](tests-unitaires.md) |
| **Tests E2E frontend** | Non implémentés | Playwright / Cypress |
| **Tests de charge** | CLI seulement | `app:seed-perf`, `app:consolidate-cli` |
| **Re-téléchargement consolidation** | Non testé | `GET /api/consolidation/export/{auditLogId}` |
| **Filtres pagination audit/stats** | Partiel | Ajouter tests query params si besoin |

---

## 10. Références croisées

| Sujet | Document / ressource |
|-------|----------------------|
| Authentification JWT cookies | [authentification.md](authentification.md) |
| Consolidation | [consolidation.md](consolidation.md) |
| Audit | [audit-logs.md](audit-logs.md) |
| Tests unitaires | [tests-unitaires.md](tests-unitaires.md) |
| Règles Cursor | `cursor/.rules.mdc` § 7.2 |
| Config PHPUnit | `backend/phpunit.dist.xml` |

---

*Dernière mise à jour : juin 2026 — 37 tests d'intégration API, 391 assertions.*
