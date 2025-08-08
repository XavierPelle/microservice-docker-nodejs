const Vendor = require('../models/Vendor');
const VendorUser = require('../models/VendorUser');
const Product = require('../models/Product');
const JWTUtils = require('../utils/jwt.utils');

const path = require('path');

class VendorController {

    async getAll(req, res) {
        try {
            const vendors = await Vendor.findAll({
                include: [{
                    model: VendorUser,
                    as: 'vendorUser',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role']
                }]
            });

            res.json(vendors);
        } catch (error) {
            console.error('Get all vendors error:', error);
            res.status(500).json({ message: 'Failed to fetch vendors.' });
        }
    }

    async createVendor(req, res) {
        try {
            const { vendorUserId, storeName, storeDescription } = req.body;

            // Check if vendorUser exists
            const vendorUser = await VendorUser.findByPk(vendorUserId);
            if (!vendorUser) {
                return res.status(404).json({ message: 'Vendor user not found' });
            }

            // Check if vendor already exists for this user
            const existingVendor = await Vendor.findOne({ where: { vendorUserId } });
            if (existingVendor) {
                return res.status(400).json({ message: 'Vendor already exists for this user' });
            }

            const vendor = await Vendor.create({
                vendorUserId,
                storeName,
                storeDescription
            });

            res.status(201).json(vendor);
        } catch (error) {
            console.error('Create vendor error:', error);
            res.status(500).json({ message: 'Server error: vendor has not been created' });
        }
    }

    async getVendor(req, res) {
        try {
            const id = req.params.id;
            const vendor = await Vendor.findByPk(id, {
                include: [{
                    model: VendorUser,
                    as: 'vendorUser',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role']
                }]
            });

            if (!vendor) {
                return res.status(404).json({ message: 'Vendor not found' });
            }

            res.json(vendor);
        } catch (error) {
            console.error('Get vendor error:', error);
            res.status(500).json({ message: 'Failed to fetch vendor.' });
        }
    }

    async updateVendor(req, res) {
        try {
            const id = req.params.id;
            const [updated] = await Vendor.update(req.body, { where: { id: id } });

            if (updated) {
                const updatedVendor = await Vendor.findByPk(id, {
                    include: [{
                        model: VendorUser,
                        as: 'vendorUser',
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role']
                    }]
                });
                res.status(200).json(updatedVendor);
            } else {
                res.status(404).json({ message: 'Vendor not found' });
            }
        } catch (error) {
            console.error('Update vendor error:', error);
            res.status(500).json({ message: "Server error: the vendor has not been updated!" });
        }
    }

    async deleteVendor(req, res) {
        try {
            const id = req.params.id;
            const vendor = await Vendor.findByPk(id);

            if (!vendor) {
                return res.status(404).json({ message: 'Vendor not found' });
            }

            await Vendor.destroy({ where: { id: id } });
            res.status(200).json({ message: 'Vendor deleted successfully' });
        } catch (error) {
            console.error('Delete vendor error:', error);
            res.status(500).json({ message: "Server error: vendor not deleted" });
        }
    }

    async updateStatus(req, res) {
        try {
            const id = req.params.id;
            const { status } = req.body;

            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }

            const [updated] = await Vendor.update({ status }, { where: { id: id } });

            if (updated) {
                const updatedVendor = await Vendor.findByPk(id);
                res.status(200).json(updatedVendor);
            } else {
                res.status(404).json({ message: 'Vendor not found' });
            }
        } catch (error) {
            console.error('Update vendor status error:', error);
            res.status(500).json({ message: "Failed to update vendor status" });
        }
    }

    async getDashboardStats(req, res) {
        try {
            const vendorId = req.params.vendorId;

            // Check if vendor exists
            const vendor = await Vendor.findByPk(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: 'Vendor not found' });
            }

            // Compter le nombre de produits du vendeur
            const totalProducts = await Product.count({
                where: { vendorId: vendorId }
            });

            // Calculer le revenu total (prix * quantité pour tous les produits)
            const products = await Product.findAll({
                where: { vendorId: vendorId },
                attributes: ['price', 'quantity']
            });

            const totalRevenue = products.reduce((sum, product) => {
                return sum + (parseFloat(product.price) * parseInt(product.quantity));
            }, 0);

            const stats = {
                vendorId: vendorId,
                storeName: vendor.storeName,
                status: vendor.status,
                totalProducts: totalProducts,
                totalOrders: 0,   // Can be implemented later
                totalRevenue: totalRevenue
            };

            res.json(stats);
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            res.status(500).json({ message: 'Failed to fetch dashboard stats' });
        }
    }

    async getVendorByUserId(req, res) {
        try {
            const userServiceId = req.params.userId; // ID de la table users
            
            // Étape 1 : Trouver vendor_users par userServiceId
            const vendorUser = await VendorUser.findOne({ 
                where: { userServiceId: userServiceId } 
            });
            
            if (!vendorUser) {
                return res.status(404).json({ message: "Vendor user not found" });
            }
            
            // Étape 2 : Trouver vendor par vendorUserId
            const vendor = await Vendor.findOne({ 
                where: { vendorUserId: vendorUser.id } 
            });
            
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
            
            // Retourner les données du vendeur avec les infos utilisateur
            res.json({ ...vendor.toJSON(), vendorUser: vendorUser });
        } catch (error) {
            console.error('Get vendor by userId error:', error);
            res.status(500).json({ message: 'Failed to fetch vendor by userId.' });
        }
    }

    // Gestion des produits avec vraie BDD
    async getProducts(req, res) {
        try {
            const vendorId = req.params.vendorId;

            // Vérifier que le vendeur existe
            const vendor = await Vendor.findByPk(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: 'Vendeur non trouvé' });
            }

            // Récupérer tous les produits du vendeur
            const products = await Product.findAll({
                where: { vendorId: vendorId },
                include: [{
                    model: Vendor,
                    as: 'vendor',
                    attributes: ['id', 'storeName']
                }]
            });

            res.json(products);
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
        }
    }

    async getProduct(req, res) {
        try {
            const productId = req.params.id;

            // Vérifier que le vendeur existe
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product non trouvé' });
            }
            res.json(product);
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
        }
    }


    async createProduct(req, res) {
        try {
            const vendorId = req.params.vendorId;
            console.log(vendorId)
            const { name, description, price, quantity } = req.body;

            // Validation des champs obligatoires
            if (!name || !price) {
                return res.status(400).json({ message: 'Nom et prix obligatoires' });
            }

            // Vérifier que le vendeur existe
            const vendor = await Vendor.findByPk(vendorId);
            console.log(console.log('vendor',vendor)
            )

            if (!vendor) {
                return res.status(404).json({ message: 'Vendeur non trouvé' });
            }

            // Générer une référence unique pour le produit
            const productReference = `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Gérer l'image si présente
            let imagePath = null;
            if (req.file) {
                imagePath = `/uploads/products/${req.file.filename}`;
            }

            // Créer le produit
            const product = await Product.create({
                name,
                description: description || '',
                price: parseFloat(price),
                quantity: quantity || 0,
                productReference,
                vendorId: parseInt(vendorId),
                image: imagePath
            });

            res.status(201).json(product);
        } catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({ message: 'Erreur lors de la création du produit' });
        }
    }


    async updateProduct(req, res) {
        try {
            const vendorId = req.params.vendorId;
            const productId = req.params.productId;
            const { name, description, price, quantity } = req.body;

            // Vérifier que le produit existe et appartient au vendeur
            const product = await Product.findOne({
                where: {
                    id: productId,
                    vendorId: vendorId
                }
            });

            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }

            // Mettre à jour le produit
            await product.update({
                name: name || product.name,
                description: description !== undefined ? description : product.description,
                price: price ? parseFloat(price) : product.price,
                quantity: quantity !== undefined ? parseInt(quantity) : product.quantity
            });

            res.json(product);
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const vendorId = req.params.vendorId;
            const productId = req.params.productId;

            // Vérifier que le produit existe et appartient au vendeur
            const product = await Product.findOne({
                where: {
                    id: productId,
                    vendorId: vendorId
                }
            });

            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }

            // Supprimer le produit
            await product.destroy();

            res.json({ message: 'Produit supprimé avec succès' });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
        }
    }

    // Retourner tous les produits de tous les vendeurs
    async getAllProducts(req, res) {
        try {
            const products = await Product.findAll({
                include: [{
                    model: Vendor,
                    as: 'vendor',
                    attributes: ['id', 'storeName']
                }]
            });
            res.json(products);
        } catch (error) {
            console.error('Erreur lors de la récupération de tous les produits:', error);
            res.status(500).json({ message: 'Erreur lors de la récupération de tous les produits' });
        }
    }
}

module.exports = VendorController;
