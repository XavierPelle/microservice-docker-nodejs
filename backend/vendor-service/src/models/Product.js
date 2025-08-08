const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vendor = require('./Vendor');

class Product extends Model {
}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    productReference: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendors',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true
});

// Définir la relation avec Vendor
Product.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });
Vendor.hasMany(Product, { foreignKey: 'vendorId', as: 'products' });

module.exports = Product; 