const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Admin extends Model {}

Admin.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
});

module.exports = Admin;