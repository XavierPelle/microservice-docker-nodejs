const express = require('express');
const AdminController = require('../controllers/admin.controller');

const router = express.Router();
const adminController = new AdminController();

// Admin CRUD operations
router.get('/admins', adminController.getAll.bind(adminController));
router.get('/admins/:id', adminController.getAdmin.bind(adminController));
router.post('/admins', adminController.createAdmin.bind(adminController));
router.put('/admins/:id', adminController.updateAdmin.bind(adminController));
router.delete('/admins/:id', adminController.deleteAdmin.bind(adminController));
router.get('/admins/user/:userId', adminController.getAdminByUserId.bind(adminController));

// Admin-specific management routes
router.get('/vendors', adminController.manageVendors.bind(adminController));
router.post('/vendors', adminController.createVendor.bind(adminController));  // Nouvelle route
router.put('/vendors/:id', adminController.manageVendors.bind(adminController));
router.delete('/vendors/:id', adminController.deleteVendor.bind(adminController));  // Nouvelle route

router.get('/users', adminController.manageUsers.bind(adminController));
router.post('/users', adminController.createUser.bind(adminController));  // Nouvelle route
router.put('/users/:id', adminController.manageUsers.bind(adminController));
router.delete('/users/:id', adminController.manageUsers.bind(adminController));

router.get('/products', adminController.manageProducts.bind(adminController));
router.post('/products', adminController.createProduct.bind(adminController));  // Nouvelle route
router.put('/products/:id', adminController.manageProducts.bind(adminController));
router.delete('/products/:id', adminController.deleteProduct.bind(adminController));  // Nouvelle route

router.get('/dashboard/stats', adminController.getDashboardStats.bind(adminController));

module.exports = router;