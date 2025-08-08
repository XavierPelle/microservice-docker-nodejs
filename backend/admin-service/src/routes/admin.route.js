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
router.put('/vendors/:id', adminController.manageVendors.bind(adminController));
router.get('/users', adminController.manageUsers.bind(adminController));
router.put('/users/:id', adminController.manageUsers.bind(adminController));
router.delete('/users/:id', adminController.manageUsers.bind(adminController));
router.get('/products', adminController.manageProducts.bind(adminController));
router.put('/products/:id', adminController.manageProducts.bind(adminController));
router.get('/dashboard/stats', adminController.getDashboardStats.bind(adminController));

module.exports = router;