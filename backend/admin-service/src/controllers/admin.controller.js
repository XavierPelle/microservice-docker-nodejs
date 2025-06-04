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
            const { action } = req.query;
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
            const { action } = req.query;
            
            if (action === 'list') {
                const response = await axios.get(`${this.userServiceUrl}/users`);
                return res.json(response.data);
            } else if (action === 'update') {
                const { userId, ...userData } = req.body;
                const response = await axios.put(`${this.userServiceUrl}/users/update/${userId}`, userData);
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
            const { action } = req.query;
            
            if (action === 'list') {
                const response = await axios.get(`${this.productServiceUrl}/products`);
                return res.json(response.data);
            } else if (action === 'approve' || action === 'reject') {
                const { productId, status } = req.body;
                const response = await axios.put(`${this.productServiceUrl}/products/${productId}/status`, { status });
                return res.json(response.data);
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
            const [usersRes, vendorsRes, productsRes] = await Promise.all([
                axios.get(`${this.userServiceUrl}/users`),
                axios.get(`${this.vendorServiceUrl}/vendors`),
                axios.get(`${this.productServiceUrl}/products`)
            ]);
            
            const stats = {
                totalUsers: usersRes.data.length,
                totalVendors: vendorsRes.data.length,
                totalProducts: productsRes.data.length,
                pendingVendorApprovals: vendorsRes.data.filter(v => v.status === 'pending').length,
                // Add more stats as needed
            };
            
            res.json(stats);
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
        }
    }
}

module.exports = AdminController;