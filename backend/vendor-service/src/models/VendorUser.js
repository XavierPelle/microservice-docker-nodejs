const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class VendorUser extends Model {}

VendorUser.init({
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: 'vendor'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'VendorUser',
    tableName: 'vendor_users'
});

module.exports = VendorUser;

// Association Sequelize avec Vendor
const Vendor = require('./Vendor');
VendorUser.hasOne(Vendor, { foreignKey: 'vendorUserId', as: 'vendor' });
