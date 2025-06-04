const Vendor = require('../models/Vendor');
const axios = require('axios');

class VendorController {
    constructor() {
        this.userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:5001';
        this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:5002';
    }

    async getAll(req, res) {
        try {
            const vendors = await Vendor.findAll();
            
            // Get corresponding user data for each vendor
            const vendorData = await Promise.all(
                vendors.map(async (vendor) => {
                    try {
                        const userResponse = await axios.get(`${this.userServiceUrl}/users/${vendor.userId}`);
                        return { ...vendor.toJSON(), user: userResponse.data };
                    } catch (error) {
                        return vendor.toJSON();
                    }
                })
            );
            
            res.json(vendorData);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch vendors.' });
        }
    }

    async createVendor(req, res) {
        try {
            const { userId, storeName, storeDescription } = req.body;
            
            // Verify if the user exists and update their role to vendor
            try {
                const userResponse = await axios.get(`${this.userServiceUrl}/users/${userId}`);
                await axios.put(`${this.userServiceUrl}/users/update/${userId}`, { role: 'vendor' });
            } catch (error) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            const vendor = await Vendor.create({
                userId,
                storeName,
                storeDescription
            });
            
            res.status(201).json(vendor);
        } catch (error) {
            res.status(500).json({ message: 'Server error: vendor has not been created' });
        }
    }

    async getVendor(req, res) {
        try {
            const id = req.params.id;
            const vendor = await Vendor.findByPk(id);
            
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
            
            // Get user details
            try {
                const userResponse = await axios.get(`${this.userServiceUrl}/users/${vendor.userId}`);
                res.json({ ...vendor.toJSON(), user: userResponse.data });
            } catch (error) {
                res.json(vendor);
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch vendor.' });
        }
    }

    async updateVendor(req, res) {
        try {
            const id = req.params.id;
            const [updated] = await Vendor.update(req.body, { where: { id: id } });
            
            if (updated) {
                res.status(200).json({ message: "Vendor updated!" });
            } else {
                res.status(404).json({ message: "Vendor not found" });
            }
        } catch (error) {
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
            
            // Update user role back to 'user'
            try {
                await axios.put(`${this.userServiceUrl}/users/update/${vendor.userId}`, { role: 'user' });
            } catch (error) {
                console.error('Error updating user role:', error);
            }
            
            const deleted = await Vendor.destroy({ where: { id: id } });
            res.status(200).json({ message: 'Vendor deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: "Server error: vendor not deleted" });
        }
    }

    async updateStatus(req, res) {
        try {
            const id = req.params.id;
            const { status } = req.body;
            
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }
            
            const [updated] = await Vendor.update({ status }, { where: { id: id } });
            
            if (updated) {
                res.status(200).json({ message: `Vendor status updated to ${status}` });
            } else {
                res.status(404).json({ message: "Vendor not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to update vendor status" });
        }
    }

    async getProducts(req, res) {
        try {
            const vendorId = req.params.vendorId;
            
            // Check if vendor exists
            const vendor = await Vendor.findByPk(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
            
            const response = await axios.get(`${this.productServiceUrl}/products/vendor/${vendorId}`);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch vendor products" });
        }
    }

    async createProduct(req, res) {
        try {
            const vendorId = req.params.vendorId;
            
            // Check if vendor exists
            const vendor = await Vendor.findByPk(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
            
            // Add vendorId to product data
            const productData = { ...req.body, vendorId: parseInt(vendorId) };
            
            const response = await axios.post(`${this.productServiceUrl}/products`, productData);
            res.status(201).json(response.data);
        } catch (error) {
            res.status(500).json({ message: "Failed to create product" });
        }
    }

    async updateProduct(req, res) {
        try {
            const vendorId = req.params.vendorId;
            const productId = req.params.productId;
            
            // Check if vendor exists
            const vendor = await Vendor.findByPk(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
            
            const response = await axios.put(`${this.productServiceUrl}/products/${productId}`, req.body);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ message: "Failed to update product" });
        }
    }

    async deleteProduct(req, res) {
        try {
            const vendorId = req.params.vendorId;
            const productId = req.params.productId;
            
            // Check if vendor exists
            const vendor = await Vendor.findByPk(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
            
            const response = await axios.delete(`${this.productServiceUrl}/products/${productId}`);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ message: "Failed to delete product" });
        }
    }

    async getDashboardStats(req, res) {
        try {
            const vendorId = req.params.vendorId;
            
            // Check if vendor exists
            const vendor = await Vendor.findByPk(vendorId);
            if (!vendor) {
                return res.status(404).json({ message: "Vendor not found" });
            }
            
            // Get product statistics
            const productsResponse = await axios.get(`${this.productServiceUrl}/products/vendor/${vendorId}`);
            const products = productsResponse.data;
            
            // Build dashboard statistics
            const stats = {
                totalProducts: products.length,
                // Add more stats as needed
            };
            
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: "Failed to get dashboard statistics" });
        }
    }
}

module.exports = VendorController;
