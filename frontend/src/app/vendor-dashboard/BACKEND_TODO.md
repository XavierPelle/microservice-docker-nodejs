# 🚀 BACKEND TODO - Dashboard Vendor

## 📍 **FICHIERS À MODIFIER**

### 1. **Vendor Controller** 
**Fichier** : `backend/vendor-service/src/controller/vendor.controller.js`

**Méthodes à ajouter :**

```javascript
// 1. Récupérer les produits du vendeur
async getProducts(req, res) {
    try {
        const vendorId = req.params.vendorId;
        // TODO: Implémenter la logique pour récupérer les produits
        // Retourner un array de produits avec: id, name, description, price, quantity
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
}

// 2. Créer un nouveau produit
async createProduct(req, res) {
    try {
        const vendorId = req.params.vendorId;
        const { name, description, price, quantity } = req.body;
        // TODO: Implémenter la logique pour créer un produit
        // Sauvegarder dans la base de données
        res.status(201).json({ message: 'Produit créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du produit' });
    }
}

// 3. Supprimer un produit
async deleteProduct(req, res) {
    try {
        const vendorId = req.params.vendorId;
        const productId = req.params.productId;
        // TODO: Implémenter la logique pour supprimer un produit
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
    }
}

// 4. Récupérer les commandes du vendeur
async getOrders(req, res) {
    try {
        const vendorId = req.params.vendorId;
        // TODO: Implémenter la logique pour récupérer les commandes
        // Retourner un array de commandes avec: id, customerName, itemsCount, total, date, status
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
    }
}
```

### 2. **Méthode Dashboard Stats** (déjà existante mais à améliorer)
**Fichier** : `backend/vendor-service/src/controller/vendor.controller.js`

**Méthode à modifier :**

```javascript
// Améliorer la méthode getDashboardStats existante
async getDashboardStats(req, res) {
    try {
        const vendorId = req.params.vendorId;
        
        // TODO: Calculer les vraies statistiques
        const stats = {
            totalRevenue: 0,        // Chiffre d'affaires total
            totalProductsSold: 0,   // Nombre de produits vendus
            totalOrders: 0          // Nombre de commandes
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du calcul des statistiques' });
    }
}
```

## 🔗 **ENDPOINTS À IMPLÉMENTER**

| Méthode | Endpoint | Description | Données attendues |
|---------|----------|-------------|-------------------|
| GET | `/vendors/{id}/dashboard` | Statistiques du vendeur | `{totalRevenue, totalProductsSold, totalOrders}` |
| GET | `/vendors/{id}/products` | Liste des produits | `[{id, name, description, price, quantity}]` |
| POST | `/vendors/{id}/products` | Ajouter un produit | `{name, description, price, quantity}` |
| DELETE | `/vendors/{id}/products/{productId}` | Supprimer un produit | - |
| GET | `/vendors/{id}/orders` | Liste des commandes | `[{id, customerName, itemsCount, total, date, status}]` |
| PUT | `/vendors/{id}` | Mettre à jour infos magasin | `{storeName, storeDescription}` |

## 🗄️ **INTÉGRATION BASE DE DONNÉES**

### **Vendor-Product Service**
- Connecter le vendor-service avec le vendor-product-service
- Utiliser les modèles existants dans `vendor-product-service/src/models/vendorProduct.js`

### **Commandes**
- Créer un nouveau service pour les commandes ou intégrer avec un service existant
- Modèle de commande à créer avec : id, vendorId, customerName, items, total, date, status

## 🧪 **TESTING**

### **Avec Postman ou curl :**

```bash
# Test statistiques
curl -X GET http://localhost:5000/vendors/1/dashboard

# Test produits
curl -X GET http://localhost:5000/vendors/1/products
curl -X POST http://localhost:5000/vendors/1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","description":"Test","price":99.99,"quantity":10}'

# Test commandes
curl -X GET http://localhost:5000/vendors/1/orders
```

## 📋 **CHECKLIST**

- [ ] Ajouter les méthodes manquantes dans `vendor.controller.js`
- [ ] Tester les endpoints avec Postman
- [ ] Intégrer avec la base de données
- [ ] Vérifier que le dashboard frontend fonctionne
- [ ] Gérer les erreurs et validations
- [ ] Documenter les APIs

## 🎯 **PRIORITÉS**

1. **HIGH** : `getProducts` et `createProduct` - Essentiel pour le dashboard
2. **MEDIUM** : `getDashboardStats` - Pour les statistiques
3. **LOW** : `getOrders` - Pour la gestion des commandes

## 💡 **NOTES**

- Le frontend utilise des données mockées pour le développement
- Une fois les endpoints implémentés, remplacer les données mockées par les vraies données API
- Les routes sont déjà définies dans `vendor.route.js`, il suffit d'ajouter les méthodes dans le controller
- Utiliser les modèles Sequelize existants pour la persistance des données

**Bon développement ! 🚀** 