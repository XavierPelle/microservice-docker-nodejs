const Admin = require('../models/Admin');
const axios = require('axios');

class AdminController {
    constructor() {
        this.userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:5001';
        this.vendorServiceUrl = process.env.VENDOR_SERVICE_URL || 'http://vendor-service:5006';
        this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:5002';
    }

    async getAll(req, res) {
        try {
            const admins = await Admin.findAll();
            
            // Get corresponding user data for each admin
            const adminData = await Promise.all(
                admins.map(async (admin) => {
                    try {
                        const userResponse = await axios.get(`${this.userServiceUrl}/users/${admin.userId}`);
                        return { ...admin.toJSON(), user: userResponse.data };
                    } catch (error) {
                        return admin.toJSON();
                    }
                })
            );
            
            res.json(adminData);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch admins.' });
        }
    }

    async createAdmin(req, res) {
        try {
            const { userId } = req.body;
            
            // Verify if the user exists and update their role to admin
            try {
                const userResponse = await axios.get(`${this.userServiceUrl}/users/${userId}`);
                await axios.put(`${this.userServiceUrl}/users/update/${userId}`, { role: 'admin' });
            } catch (error) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            const admin = await Admin.create({
                userId,
                lastLogin: new Date()
            });
            
            res.status(201).json(admin);
        } catch (error) {
            res.status(500).json({ message: 'Server error: admin has not been created' });
        }
    }

    async getAdmin(req, res) {
        try {
            const id = req.params.id;
            const admin = await Admin.findByPk(id);
            
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            
            // Get user details
            try {
                const userResponse = await axios.get(`${this.userServiceUrl}/users/${admin.userId}`);
                res.json({ ...admin.toJSON(), user: userResponse.data });
            } catch (error) {
                res.json(admin);
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch admin.' });
        }
    }

    async updateAdmin(req, res) {
        try {
            const id = req.params.id;
            const [updated] = await Admin.update(req.body, { where: { id: id } });
            
            if (updated) {
                res.status(200).json({ message: "Admin updated!" });
            } else {
                res.status(404).json({ message: "Admin not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Server error: the admin has not been updated!" });
        }
    }

    async deleteAdmin(req, res) {
        try {
            const id = req.params.id;
            const admin = await Admin.findByPk(id);
            
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            
            // Update user role back to 'user'
            try {
                await axios.put(`${this.userServiceUrl}/users/update/${admin.userId}`, { role: 'user' });
            } catch (error) {
                console.error('Error updating user role:', error);
            }
            
            const deleted = await Admin.destroy({ where: { id: id } });
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: "Server error: admin not deleted" });
        }
    }

    async getAdminByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const admin = await Admin.findOne({ where: { userId } });
            
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            
            // Get user details
            try {
                const userResponse = await axios.get(`${this.userServiceUrl}/users/${userId}`);
                res.json({ ...admin.toJSON(), user: userResponse.data });
            } catch (error) {
                res.json(admin);
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch admin.' });
        }
    }

    // Admin management functions
    async manageVendors(req, res) {
        try {
            const action = req.query.action || 'list';
            const { vendorId, status } = req.body;
            
            if (action === 'approve' || action === 'reject') {
                const response = await axios.put(`${this.vendorServiceUrl}/vendors/${vendorId}/status`, { status });
                return res.json(response.data);
            } else if (action === 'list') {
                const response = await axios.get(`${this.vendorServiceUrl}/vendors`);
                return res.json(response.data);
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }
        } catch (error) {
            console.error('Error managing vendors:', error);
            res.status(500).json({ message: 'Failed to manage vendors', error: error.message });
        }
    }

    async manageUsers(req, res) {
        try {
            const action = req.query.action || 'list';
            
            if (action === 'list') {
                const response = await axios.get(`${this.userServiceUrl}/users`);
                return res.json(response.data);
            } else if (action === 'update') {
                const { id, ...userData } = req.body;
                const response = await axios.put(`${this.userServiceUrl}/users/update/${id}`, userData);
                return res.json(response.data);
            } else if (action === 'delete') {
                const { userId } = req.body;
                const response = await axios.delete(`${this.userServiceUrl}/users/delete/${userId}`);
                return res.json(response.data);
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }
        } catch (error) {
            console.error('Error managing users:', error);
            res.status(500).json({ message: 'Failed to manage users', error: error.message });
        }
    }

    async manageProducts(req, res) {
        try {
            const action = req.query.action || 'list';
            
            if (action === 'list') {
                // Appeler le vendor-service pour récupérer tous les produits de tous les vendeurs
                const response = await axios.get(`${this.vendorServiceUrl}/vendors/products`);
                return res.json(response.data);
            } else if (action === 'approve' || action === 'reject') {
                const { productId, status } = req.body;
                // Pour l'instant, on ne gère pas l'approbation/rejet des produits
                return res.status(400).json({ message: 'Action non supportée pour les produits' });
            } else {
                return res.status(400).json({ message: 'Invalid action' });
            }
        } catch (error) {
            console.error('Error managing products:', error);
            res.status(500).json({ message: 'Failed to manage products', error: error.message });
        }
    }

    async getDashboardStats(req, res) {
        try {
            // Get counts from various services
            const [usersRes, vendorsRes] = await Promise.all([
                axios.get(`${this.userServiceUrl}/users`),
                axios.get(`${this.vendorServiceUrl}/vendors`)
            ]);
            
            const stats = {
                totalUsers: usersRes.data.length,
                totalVendors: vendorsRes.data.length,
                totalProducts: 0, // On ne compte pas les produits pour l'instant
                pendingVendorApprovals: vendorsRes.data.filter(v => v.status === 'pending').length,
                // Add more stats as needed
            };
            
            res.json(stats);
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
        }
    }

    // Nouvelles méthodes pour créer des entités
    async createVendor(req, res) {
        try {
            const { firstName, lastName, email, password, storeName, storeDescription } = req.body;
            
            // Validation
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: 'Prénom, nom, email et mot de passe sont obligatoires' });
            }
            
            // 1. Créer l'utilisateur via auth-service
            const userData = {
                firstName,
                lastName,
                email,
                role: 'vendor'
            };
            
            const authResponse = await axios.post(`http://auth-service:5004/register`, userData);
            
            // 2. Mettre à jour avec le mot de passe
            await axios.post(`http://auth-service:5004/register_up`, {
                email,
                password
            });
            
            // 3. Récupérer l'utilisateur créé pour avoir son ID
            const userResponse = await axios.get(`${this.userServiceUrl}/users/${email}`);
            const user = userResponse.data;
            
            // 4. Créer l'utilisateur vendeur dans vendor-service
            const vendorUserData = {
                firstName,
                lastName,
                email,
                password,
                userServiceId: user.id,
                role: 'vendor'
            };
            
            const vendorUserResponse = await axios.post(`${this.vendorServiceUrl}/auth/register`, vendorUserData);
            
            // 5. Créer le profil vendeur
            const vendorData = {
                vendorUserId: vendorUserResponse.data.userId,
                storeName: storeName || `${firstName} ${lastName} Store`,
                storeDescription: storeDescription || 'Boutique créée par l\'admin'
            };
            
            const vendorResponse = await axios.post(`${this.vendorServiceUrl}/vendors`, vendorData);
            
            res.status(201).json({
                message: 'Vendeur créé avec succès',
                vendor: vendorResponse.data
            });
        } catch (error) {
            console.error('Error creating vendor:', error);
            res.status(500).json({ 
                message: 'Erreur lors de la création du vendeur', 
                error: error.response?.data?.message || error.message 
            });
        }
    }

    async createProduct(req, res) {
        try {
            const { name, description, price, quantity } = req.body;
            
            // Validation
            if (!name || !price) {
                return res.status(400).json({ message: 'Nom et prix sont obligatoires' });
            }
            
            // Trouver ou créer un vendeur "Admin" par défaut
            let adminVendor = await axios.get(`${this.vendorServiceUrl}/vendors`)
                .then(response => response.data.find(v => v.storeName === 'Admin Store'))
                .catch(() => null);
            
            if (!adminVendor) {
                // Créer un vendeur admin par défaut s'il n'existe pas
                try {
                    const adminVendorData = {
                        vendorUserId: 1, // ID par défaut pour admin
                        storeName: 'Admin Store',
                        storeDescription: 'Produits créés par l\'administrateur'
                    };
                    const adminVendorResponse = await axios.post(`${this.vendorServiceUrl}/vendors`, adminVendorData);
                    adminVendor = adminVendorResponse.data;
                } catch (error) {
                    console.error('Erreur création vendeur admin:', error);
                    return res.status(500).json({ message: 'Impossible de créer le vendeur admin par défaut' });
                }
            }
            
            // Créer le produit via vendor-service
            const productData = {
                name,
                description: description || '',
                price: parseFloat(price),
                quantity: quantity || 0
            };
            
            const productResponse = await axios.post(`${this.vendorServiceUrl}/vendors/${adminVendor.id}/products`, productData);
            
            res.status(201).json({
                message: 'Produit créé avec succès',
                product: productResponse.data
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ 
                message: 'Erreur lors de la création du produit', 
                error: error.response?.data?.message || error.message 
            });
        }
    }

    async createUser(req, res) {
        try {
            const { firstName, lastName, email, password, role } = req.body;
            
            // Validation
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
            }
            
            // Créer l'utilisateur via auth-service
            const userData = {
                firstName,
                lastName,
                email,
                role: role || 'user'
            };
            
            // Étape 1: Créer dans auth-service
            const authResponse = await axios.post(`http://auth-service:5004/register`, userData);
            
            // Étape 2: Mettre à jour avec le mot de passe
            await axios.post(`http://auth-service:5004/register_up`, {
                email,
                password
            });
            
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                user: userData
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ 
                message: 'Erreur lors de la création de l\'utilisateur', 
                error: error.response?.data?.message || error.message 
            });
        }
    }

    async deleteVendor(req, res) {
        try {
            const vendorId = req.params.id;
            
            // Supprimer le vendeur via vendor-service
            await axios.delete(`${this.vendorServiceUrl}/vendors/${vendorId}`);
            
            res.json({ message: 'Vendeur supprimé avec succès' });
        } catch (error) {
            console.error('Error deleting vendor:', error);
            res.status(500).json({ 
                message: 'Erreur lors de la suppression du vendeur', 
                error: error.response?.data?.message || error.message 
            });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            
            // Récupérer le produit pour connaître son vendeur via vendor-service
            const productsResponse = await axios.get(`${this.vendorServiceUrl}/vendors/products`);
            const product = productsResponse.data.find(p => p.id == productId);
            
            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            
            // Supprimer le produit via vendor-service
            await axios.delete(`${this.vendorServiceUrl}/vendors/${product.vendorId}/products/${productId}`);
            
            res.json({ message: 'Produit supprimé avec succès' });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ 
                message: 'Erreur lors de la suppression du produit', 
                error: error.response?.data?.message || error.message 
            });
        }
    }
}

module.exports = AdminController;