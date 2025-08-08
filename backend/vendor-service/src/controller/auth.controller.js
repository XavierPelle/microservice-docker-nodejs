const VendorUser = require('../models/VendorUser');
const Vendor = require('../models/Vendor');
const JWTUtils = require('../utils/jwt.utils');
const crypto = require('crypto');

class AuthController {
    
    async register(req, res) {
        try {
            const { email, firstName, lastName, role } = req.body;
            
            // Check if user already exists
            const existingUser = await VendorUser.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Generate salt
            const salt = JWTUtils.generateSalt();
            
            // Create user without password first
            const user = await VendorUser.create({
                email,
                firstName,
                lastName,
                role: 'vendor',
                salt,
                password: 'temp' // Will be updated later
            });

            res.status(201).json({
                message: 'User registered successfully',
                salt: salt,
                userId: user.id
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Server error during registration' });
        }
    }

    async registerComplete(req, res) {
        try {
            const { email, password } = req.body;
            
            // Find user by email
            const user = await VendorUser.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update password
            await user.update({ password });

            res.status(200).json({ 
                message: 'Registration completed successfully',
                userId: user.id 
            });

        } catch (error) {
            console.error('Registration completion error:', error);
            res.status(500).json({ message: 'Server error during registration completion' });
        }
    }

    async loginSend(req, res) {
        try {
            const { email } = req.body;
            
            const user = await VendorUser.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                message: 'User found',
                salt: user.salt,
                userId: user.id
            });

        } catch (error) {
            console.error('Login send error:', error);
            res.status(500).json({ message: 'Server error during login' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const user = await VendorUser.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify password
            if (user.password !== password) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = JWTUtils.createJWT(user.id, user.email);

            res.status(200).json({
                message: 'Login successful',
                access_token: token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error during login' });
        }
    }

    async verifyToken(req, res) {
        try {
            const { token, user_id } = req.body;
            
            const decoded = JWTUtils.verifyToken(token);
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Check if user exists and token user_id matches
            if (decoded.user_id !== user_id) {
                return res.status(401).json({ message: 'Token user mismatch' });
            }

            const user = await VendorUser.findByPk(user_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ 
                message: 'Token is valid',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });

        } catch (error) {
            console.error('Token verification error:', error);
            res.status(500).json({ message: 'Server error during token verification' });
        }
    }
}

module.exports = AuthController;
