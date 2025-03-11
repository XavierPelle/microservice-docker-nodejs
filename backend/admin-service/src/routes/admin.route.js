// filepath: /admin-service/admin-service/src/routes/admin.route.js
const express = require('express');
const AdminController = require('../controllers/admin.controller');

const router = express.Router();
const adminController = new AdminController();

router.post('/admins', adminController.createAdmin);
router.get('/admins/:id', adminController.getAdmin);
router.delete('/admins/:id', adminController.deleteAdmin);

module.exports = router;