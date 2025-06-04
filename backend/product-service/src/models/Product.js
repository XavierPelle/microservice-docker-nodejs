const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model {
}
Product.init({
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    productReference: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
});
module.exports = Product;