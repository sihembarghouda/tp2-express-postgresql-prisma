# TP2 — API Full Stack avec Express, PostgreSQL et Prisma

## 1. Présentation du projet

Ce projet consiste à développer une API REST avec Node.js, Express, TypeScript, PostgreSQL et Prisma. L’API permet de gérer des catégories et des produits à travers les opérations CRUD : création, consultation, modification et suppression.

Le projet intègre également la validation des données, la gestion centralisée des erreurs, la recherche, la pagination et des tests automatisés.

## 2. Technologies utilisées

- Node.js et TypeScript
- Express.js pour créer l’API REST
- PostgreSQL pour stocker les données
- Docker Compose pour exécuter PostgreSQL
- Prisma ORM pour accéder à la base de données et gérer les migrations
- Zod pour valider les données des requêtes
- Helmet pour ajouter des en-têtes HTTP de sécurité
- CORS pour gérer les accès cross-origin
- Morgan pour enregistrer les requêtes HTTP
- Jest et Supertest pour les tests automatisés
- Thunder Client pour tester les routes manuellement

## 3. Structure du projet

```text
fullstack-tp/
├── docker-compose.yml
├── ngapp/
├── nxapp/
└── api/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── migrations/
    │   └── seed.ts
    ├── src/
    │   ├── generated/
    │   │   └── prisma/
    │   ├── lib/
    │   │   └── prisma.ts
    │   ├── routes/
    │   │   ├── categories.ts
    │   │   └── products.ts
    │   ├── validators/
    │   └── server.ts
    ├── tests/
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── prisma7.config.ts
    ├── tsconfig.json
    └── README.md
```

Cette structure présente les principaux fichiers du projet. Certains fichiers de configuration et de test peuvent varier selon l’organisation finale du dépôt.

Le fichier `.env` contient les paramètres de connexion à la base de données et ne doit pas être publié sur GitHub.

## 4. Installation et lancement

### 4.1. Prérequis

- Node.js et npm
- Docker Desktop
- Git

### 4.2. Démarrer PostgreSQL

Depuis le dossier racine `fullstack-tp`, exécuter :

```powershell
docker compose up -d
docker compose ps
```

La configuration Docker du projet utilise les paramètres suivants :

- Base de données : `shop`
- Utilisateur : `app`
- Port PostgreSQL interne : `5432`
- Port publié sur Windows : `5433`

Ces paramètres doivent correspondre à la configuration réelle de Docker Compose.

### 4.3. Configurer l’API

Dans le dossier `api`, créer ou vérifier le fichier `.env` à partir de `.env.example`.

La variable de connexion doit respecter le format suivant :

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5433/shop?schema=public"
PORT=4000
```

Remplacer `USER` et `PASSWORD` par les identifiants réellement définis dans la configuration PostgreSQL. Ne pas publier les véritables identifiants.

### 4.4. Installer les dépendances

Depuis le dossier `api` :

```powershell
npm install
```

### 4.5. Préparer Prisma et la base de données

Générer le client Prisma :

```powershell
npx prisma generate
```

Appliquer les migrations existantes :

```powershell
npx prisma migrate dev
```

Pour initialiser les catégories et les produits de démonstration, utiliser la commande de seed définie dans `package.json`, par exemple :

```powershell
npx prisma db seed
```

La commande de seed doit être configurée dans le projet pour que cette dernière commande fonctionne.

### 4.6. Démarrer l’API

```powershell
npm run dev
```

L’API est accessible à l’adresse :

`http://localhost:4000`

La route de vérification de santé est :

`http://localhost:4000/api/health`

Pour compiler le projet TypeScript :

```powershell
npm run build
```

## 5. Modèle de données

### 5.1. Category

Une catégorie possède :

- un identifiant unique ;
- un nom unique ;
- une date de création ;
- une date de modification.

Une catégorie peut contenir plusieurs produits.

### 5.2. Product

Un produit possède :

- un identifiant ;
- un titre ;
- une description ;
- un prix ;
- une image ;
- un identifiant de catégorie ;
- une date de création ;
- une date de modification.

Chaque produit appartient à une catégorie. La relation entre les deux modèles est gérée par Prisma et PostgreSQL.

## 6. Routes de l’API

### 6.1. Santé du serveur

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/health` | Vérifier que l’API fonctionne |

### 6.2. Catégories

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | Lister les catégories |
| GET | `/api/categories/:id` | Consulter une catégorie |
| POST | `/api/categories` | Créer une catégorie |
| PUT | `/api/categories/:id` | Modifier une catégorie |
| DELETE | `/api/categories/:id` | Supprimer une catégorie |

### 6.3. Produits

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/products` | Lister les produits avec leur catégorie |
| GET | `/api/products/:id` | Consulter un produit |
| POST | `/api/products` | Créer un produit |
| PUT | `/api/products/:id` | Modifier un produit |
| DELETE | `/api/products/:id` | Supprimer un produit |

### 6.4. Recherche et pagination

La liste des produits accepte des paramètres de requête :

- `search` : rechercher un produit selon le texte pris en charge par l’API ;
- `page` : choisir le numéro de page ;
- `limit` : définir le nombre de produits par page.

Exemples :

```http
GET /api/products?search=casque
GET /api/products?page=1&limit=5
GET /api/products?search=casque&page=1&limit=5
```

### 6.5. Exemple de création d’un produit

Requête `POST /api/products`, avec le corps JSON suivant :

```json
{
  "title": "Casque Bluetooth",
  "description": "Casque sans fil",
  "price": 89,
  "image": "https://placehold.co/300x200",
  "categoryId": 1
}
```

La catégorie correspondant à `categoryId` doit exister dans la base de données.

## 7. Validation et gestion des erreurs

### 7.1. Validation des données

Zod est utilisé pour vérifier les données envoyées dans les requêtes. Cela permet notamment de contrôler les champs obligatoires et les types de données attendus.

### 7.2. Gestion centralisée des erreurs

L’API utilise un gestionnaire centralisé pour renvoyer des réponses HTTP adaptées aux erreurs rencontrées.

| Code HTTP | Signification |
|---|---|
| 200 | Requête réussie |
| 201 | Ressource créée |
| 400 | Requête invalide ou JSON mal formé |
| 404 | Ressource introuvable |
| 409 | Conflit, par exemple un nom unique déjà utilisé |
| 500 | Erreur interne du serveur |

Les erreurs Prisma connues sont converties en réponses HTTP adaptées lorsque cela est prévu par le gestionnaire d’erreurs.

## 8. Tests

### 8.1. Tests automatisés

Les tests automatisés vérifient le fonctionnement des routes, les opérations CRUD et la gestion des erreurs.

Pour lancer les tests :

```powershell
npm test
```

Pour vérifier la compilation :

```powershell
npm run build
```

Le projet a été testé avec une suite de 22 tests automatisés réussis.

### 8.2. Tests manuels avec Thunder Client

Les tests manuels couvrent notamment :

- la disponibilité de l’API via `/api/health` ;
- la consultation des catégories et des produits ;
- la création, la modification et la suppression de catégories ;
- la création et la consultation de produits ;
- la modification et la suppression de produits ;
- la recherche et la pagination des produits.

Les tests doivent être réalisés avec des identifiants existants et des données adaptées à la base de données.

## 9. Sécurité et bonnes pratiques

- Conserver les identifiants de connexion dans `.env`.
- Exclure `.env` du dépôt Git.
- Fournir `.env.example` sans secrets.
- Utiliser Helmet pour renforcer les en-têtes HTTP de sécurité.
- Configurer CORS selon les besoins du projet.
- Valider les données entrantes avec Zod.
- Utiliser Prisma pour accéder aux données et gérer les relations.
- Centraliser la gestion des erreurs.
- Utiliser des migrations et un script de seed pour faciliter la reproductibilité du projet.

## 10. Améliorations possibles

Les évolutions envisageables comprennent :

- l’ajout d’une authentification et d’une gestion des rôles ;
- la connexion de l’API aux interfaces Angular et Next.js ;
- l’ajout de tests d’intégration supplémentaires ;
- la mise en place d’une documentation interactive avec Swagger ;
- le déploiement de l’API et de la base de données sur un environnement de production.

## 11. Conclusion

Ce TP a permis de développer une API REST avec Express et TypeScript, connectée à PostgreSQL avec Prisma. L’application prend en charge la gestion des catégories et des produits, la validation des données, la recherche, la pagination et la gestion centralisée des erreurs.

Les tests automatisés et les vérifications manuelles permettent de contrôler le fonctionnement des principales fonctionnalités. La structure du projet facilite sa maintenance et son évolution vers une application full stack complète.
