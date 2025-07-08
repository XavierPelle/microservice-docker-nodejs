
### **API Endpoints Utilisés**
```
GET    /admin/dashboard/stats     # Statistiques du dashboard
GET    /admin/admins              # Liste des admins
POST   /admin/admins              # Créer un admin
DELETE /admin/admins/:id          # Supprimer un admin
GET    /admin/vendors             # Liste des vendeurs
PUT    /admin/vendors/:id         # Approuver/Rejeter un vendeur
GET    /admin/users               # Liste des utilisateurs
PUT    /admin/users/:id           # Modifier un utilisateur
DELETE /admin/users/:id           # Supprimer un utilisateur
GET    /admin/products            # Liste des produits
PUT    /admin/products/:id        # Modifier un produit
DELETE /admin/products/:id        # Supprimer un produit
```


## 🚀 **Fontiocnnaliter**

### **Accès au Dashboard**
1. Se connecter avec un compte admin
2. Naviguer vers `/admin-dashboard`
3. Utiliser les onglets pour accéder aux différentes sections

### **Gestion des Admins**
1. Aller dans l'onglet "Admins"
2. Cliquer sur "+ Ajouter Admin"
3. Sélectionner un utilisateur dans la liste
4. Confirmer la création

### **Gestion des Vendeurs**
1. Aller dans l'onglet "Vendeurs"
2. Voir la liste des vendeurs avec leurs statuts
3. Cliquer sur "Approuver" ou "Rejeter" selon le cas
4. Les statuts se mettent à jour en temps réel

### **Gestion des Utilisateurs**
1. Aller dans l'onglet "Utilisateurs"
2. Cliquer sur "Modifier" pour éditer un utilisateur
3. Modifier les informations dans le formulaire
4. Sauvegarder les modifications

### **Gestion des Produits**
1. Aller dans l'onglet "Produits"
2. Voir la liste des produits en cartes
3. Cliquer sur "Modifier" pour éditer un produit
4. Modifier les informations et sauvegarder


Lancer le scipt avec cd backend/scripts et python create-admin.py

docker exec -it db_user-service psql -U main -d db_user-service pour ouvrir une table et voir dedans 
docker exec -it db_vendor-service psql -U main -d db_vendor-service pou rle vendor
docker exec -it db_vendor-service psql -U main -d db_vendor-service select * from products, pour produit 
