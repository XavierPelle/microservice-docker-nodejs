const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Vendor extends Model {}

Vendor.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
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
