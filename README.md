\# TP2 — API Full Stack avec Express, PostgreSQL et Prisma



\## 1. Présentation du projet



Ce projet consiste à développer une API REST avec \*\*Node.js, Express, PostgreSQL et Prisma\*\*. L’API permet de gérer des catégories et des produits à travers des opérations CRUD : création, consultation, modification et suppression.



\## 2. Technologies utilisées



\- Node.js et TypeScript

\- Express.js pour créer l’API REST

\- PostgreSQL pour stocker les données

\- Docker Compose pour exécuter PostgreSQL

\- Prisma ORM pour accéder à la base de données

\- CORS, Helmet et Morgan pour la sécurité, les accès cross-origin et les logs HTTP

\- Zod installé pour la validation des données



\## 3. Structure du projet



```text

fullstack-tp/

├── docker-compose.yml

├── ngapp/

├── nxapp/

└── api/

&#x20;   ├── prisma/

&#x20;   │   ├── schema.prisma

&#x20;   │   └── migrations/

&#x20;   ├── src/

&#x20;   │   ├── generated/

&#x20;   │   │   └── prisma/

&#x20;   │   ├── lib/

&#x20;   │   │   └── prisma.ts

&#x20;   │   ├── routes/

&#x20;   │   │   ├── categories.ts

&#x20;   │   │   └── products.ts

&#x20;   │   └── server.ts

&#x20;   ├── .env

&#x20;   ├── package.json

&#x20;   ├── prisma7.config.ts

&#x20;   └── tsconfig.json

```



Le fichier `.env` contient les paramètres de connexion et ne doit pas être envoyé sur GitHub.



\## 4. Installation et lancement



\### Prérequis



\- Node.js et npm

\- Docker Desktop

\- Git



\### Démarrer PostgreSQL



Depuis le dossier racine `fullstack-tp`, exécuter :



```powershell

docker compose up -d

docker compose ps

```



La base PostgreSQL est créée avec les paramètres suivants :



\- Base de données : `shop`

\- Utilisateur : `app`

\- Port PostgreSQL interne : `5432`

\- Port publié sur Windows : `5433`



\### Configurer l'API



Dans `api/.env` :



```dotenv

DATABASE\_URL="postgresql://app:app@127.0.0.1:5433/shop?schema=public"

PORT=4000

```



Installer les dépendances et préparer Prisma :



```powershell

cd api

npm install

npx prisma generate

npx prisma migrate dev

```



\### Démarrer le serveur Express



```powershell

npm run dev

```



L'API est accessible à l'adresse :



`http://localhost:4000`



Pour compiler le projet TypeScript :



```powershell

npm run build

```



\## 5. Modèle de données



\### Category



Une catégorie possède un identifiant unique, un nom unique et des dates de création et de modification. Elle peut contenir plusieurs produits.



\### Product



Un produit possède un identifiant, un titre, une description, un prix, une image, un identifiant de catégorie et des dates de création et de modification.



Chaque produit appartient à une catégorie. La suppression d'une catégorie associée à des produits est protégée par la contrainte de relation définie dans Prisma.



\## 6. Routes de l'API



\### Santé du serveur



| Méthode | Route | Description |

|---|---|---|

| GET | `/api/health` | Vérifier que l'API fonctionne |



\### Catégories



| Méthode | Route | Description |

|---|---|---|

| GET | `/api/categories` | Lister les catégories |

| GET | `/api/categories/:id` | Consulter une catégorie |

| POST | `/api/categories` | Créer une catégorie |

| PUT | `/api/categories/:id` | Modifier une catégorie |

| DELETE | `/api/categories/:id` | Supprimer une catégorie |



\### Produits



| Méthode | Route | Description |

|---|---|---|

| GET | `/api/products` | Lister les produits avec leur catégorie |

| GET | `/api/products/:id` | Consulter un produit |

| POST | `/api/products` | Créer un produit |

| PUT | `/api/products/:id` | Modifier un produit |

| DELETE | `/api/products/:id` | Supprimer un produit |



\### Exemple de création d'un produit



Requête `POST /api/products` avec un corps JSON :



```json

{

&#x20; "title": "Casque Bluetooth",

&#x20; "description": "Casque sans fil",

&#x20; "price": 89,

&#x20; "image": "https://placehold.co/300x200",

&#x20; "categoryId": 1

}

```



La catégorie indiquée par `categoryId` doit exister dans la base de données.



\## 7. Tests réalisés



Les tests manuels effectués comprennent :



\- Vérification de la disponibilité de l'API avec `/api/health`.

\- Consultation des catégories et des produits.

\- Création de catégories et de produits.

\- Modification du prix et de la description d'un produit.

\- Suppression d'un produit.

\- Vérification des données après les opérations.



\## 8. Sécurité et bonnes pratiques



\- Les paramètres de connexion sont conservés dans `.env`.

\- Le fichier `.env` ne doit pas être publié sur GitHub.

\- Helmet ajoute des en-têtes HTTP de sécurité.

\- CORS limite les origines autorisées par l'API.

\- Express analyse les requêtes JSON.

\- Prisma gère l'accès à la base et les relations entre les modèles.



\## 9. Améliorations possibles



\- Ajouter une validation complète des requêtes avec Zod.

\- Gérer les erreurs Prisma avec des codes HTTP adaptés, notamment `404` et `409`.

\- Ajouter des tests automatisés.

\- Connecter l'API au frontend Angular ou Next.js.

\- Ajouter des données initiales reproductibles avec un script de seed.



\## 10. Conclusion



Ce TP permet de mettre en place une API REST avec Express et TypeScript, de persister les données dans PostgreSQL avec Docker et d'utiliser Prisma pour gérer les modèles et les migrations. Les opérations CRUD des catégories et des produits ont été testées manuellement.





