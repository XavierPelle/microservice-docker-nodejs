# Service de Promotion

## Aperçu du Projet

Le Service de Promotion est un microservice conçu pour générer et gérer des codes promotionnels destinés aux clients à forte activité dans notre écosystème de commerce électronique. Il fournit un mécanisme sophistiqué pour récompenser les clients ayant effectué des achats significatifs.

## Fonctionnalités Clés

### 1. Génération de Codes Promotionnels
- Génère automatiquement des codes promotionnels uniques pour les utilisateurs ayant effectué plus de 100 achats.
- Met en place un système de remises par paliers basé sur le nombre total d'achats.
- Évite la duplication de codes promotionnels inutilisés pour un même utilisateur.

### 2. Paliers de Remises
- 100-250 achats : remise de 10 %
- 251-500 achats : remise de 15 %
- 501-1000 achats : remise de 20 %
- Plus de 1000 achats : remise de 25 %

## Architecture Technique

### Composants
- **Base de données** : MongoDB pour le stockage des détails des codes promotionnels.
- **Framework** : Express.js pour le routage des API.
- **Modèle** : Schéma Mongoose pour le modèle PromotionCode.
- **Conteneurisation** : Docker pour le déploiement du service.

### Points de Terminaison API

#### 1. Générer un Code Promotionnel
- **Point de terminaison** : `POST /api/promotions/generate`
- **Fonctionnalité** : 
  - Vérifie le nombre total d'achats de l'utilisateur via le service d'historique des transactions.
  - Génère un code promotionnel unique si l'utilisateur est éligible.
  - Empêche la création de plusieurs codes inutilisés pour un même utilisateur.

#### 2. Valider un Code Promotionnel
- **Point de terminaison** : `POST /api/promotions/validate`
- **Fonctionnalité** :
  - Vérifie la validité du code promotionnel.
  - Contrôle la date d'expiration et l'état d'utilisation du code.
  - Retourne le pourcentage de remise si valide.

#### 3. Utiliser un Code Promotionnel
- **Point de terminaison** : `POST /api/promotions/use`
- **Fonctionnalité** :
  - Marque le code promotionnel comme utilisé.
  - Empêche la réutilisation d’un même code.

## Détails de l’Implémentation

### Modèle de Code Promotionnel
- Génération de codes uniques à l’aide d’UUID.
- Suivi de l’ID utilisateur, du nombre d’achats et de l’état d’utilisation.
- Expiration automatique après 30 jours.
- Pourcentage de remise configurable.

### Communication Interservices
- Récupère le nombre d’achats de l’utilisateur via le service d’historique des transactions.
- Architecture découplée pour une meilleure scalabilité.

## Configuration de l’Environnement

### Variables d’Environnement Requises
- `PORT` : Port d’écoute du service.
- `MONGODB_URI` : Chaîne de connexion MongoDB.
- `NODE_ENV` : Environnement de l’application (développement/production).

### Considérations de Sécurité
- Variables d’environnement gérées via un fichier `.env`.
- Fichier `.env` exclu du contrôle de version.
- Modèle fourni dans `.env.example`.

## Intégration avec Docker

### Configuration du Service
- Conteneurisé avec Docker.
- Base de données MongoDB dédiée.
- Configuration réseau pour la communication entre microservices.

## Configuration pour le Développement

1. Clonez le dépôt.
2. Installez les dépendances : `npm install`.
3. Copiez `.env.example` vers `.env` et configurez-le.
4. Lancez le service : `npm start`.
5. Exécutez les tests : `npm test`.

## Déploiement

### Docker Compose
- Intégré dans l’architecture existante des microservices.
- Connecte automatiquement le service avec les autres composants.
- Stockage persistant des données pour les codes promotionnels.

## Améliorations Futures
- Ajouter des algorithmes plus avancés pour la génération de codes.
- Implémenter des mécanismes de mise en cache avancés.
- Créer des paliers de remise plus granulaires.
- Ajouter des fonctionnalités de journalisation et de surveillance complètes.

## Contribution
Veuillez lire le fichier CONTRIBUTING.md pour connaître notre code de conduite et le processus pour soumettre des pull requests.

