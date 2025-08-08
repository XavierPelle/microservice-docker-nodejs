const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Vendor extends Model {}

Vendor.init({
    vendorUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'vendor_users',
            key: 'id'
        }
    },
    storeName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    storeDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    sequelize,
    modelName: 'Vendor',
    tableName: 'vendors'
});

module.exports = Vendor;

// Association Sequelize avec VendorUser
const VendorUser = require('./VendorUser');
Vendor.belongsTo(VendorUser, { foreignKey: 'vendorUserId', as: 'vendorUser' });
