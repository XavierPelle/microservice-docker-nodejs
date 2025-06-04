const express = require('express');
const AdminController = require('../controllers/admin.controller');

const router = express.Router();
const adminController = new AdminController();

// Admin CRUD operations
router.get('/admins', adminController.getAll);
router.get('/admins/:id', adminController.getAdmin);
router.post('/admins', adminController.createAdmin);
router.put('/admins/:id', adminController.updateAdmin);
router.delete('/admins/:id', adminController.deleteAdmin);
router.get('/admins/user/:userId', adminController.getAdminByUserId);

// Admin-specific management routes
router.get('/vendors', adminController.manageVendors);
router.put('/vendors/:id', adminController.manageVendors);
router.get('/users', adminController.manageUsers);
router.put('/users/:id', adminController.manageUsers);
router.delete('/users/:id', adminController.manageUsers);
router.get('/products', adminController.manageProducts);
router.put('/products/:id', adminController.manageProducts);
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;