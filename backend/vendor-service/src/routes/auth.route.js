const express = require('express');
const AuthController = require('../controller/auth.controller');

const router = express.Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', authController.register);
router.post('/register-complete', authController.registerComplete);
router.post('/login-send', authController.loginSend);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);

module.exports = router;
