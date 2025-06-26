const Vendor = require('../models/Vendor');
const VendorUser = require('../models/VendorUser');
const JWTUtils = require('../utils/jwt.utils');

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

            // For now, return basic stats - can be extended later
            const stats = {
                vendorId: vendorId,
                storeName: vendor.storeName,
                status: vendor.status,
                totalProducts: 0, // Can be implemented later when integrating with product service
                totalOrders: 0,   // Can be implemented later
                totalRevenue: 0   // Can be implemented later
            };

            res.json(stats);
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            res.status(500).json({ message: 'Failed to fetch dashboard stats' });
        }
    }
}

module.exports = VendorController;
