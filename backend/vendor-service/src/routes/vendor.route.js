const express = require('express');
const VendorController = require('../controller/vendor.controller');

const router = express.Router();
const vendorController = new VendorController();

// Route pour récupérer tous les produits de tous les vendeurs (doit être tout en haut)
router.get('/products', vendorController.getAllProducts);

// Vendor CRUD operations
router.get('/', vendorController.getAll);
router.get('/:id', vendorController.getVendor);
router.post('/', vendorController.createVendor);
router.put('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);
router.put('/:id/status', vendorController.updateStatus);

// Product management
// router.get('/:vendorId/products', vendorController.getProducts);
// router.post('/:vendorId/products', vendorController.createProduct);
// router.put('/:vendorId/products/:productId', vendorController.updateProduct);
// router.delete('/:vendorId/products/:productId', vendorController.deleteProduct);

// Dashboard
router.get('/:vendorId/dashboard', vendorController.getDashboardStats);

router.get('/user/:userId', vendorController.getVendorByUserId);

module.exports = router;
