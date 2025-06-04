<<<<<<< HEAD
const { Model, DataTypes } = require('sequelize');
=======
    const { Model, DataTypes } = require('sequelize');
>>>>>>> 846a4ce70f29f3d00cbc77415fa1672aca86b9d1
const sequelize = require('../config/database');

class User extends Model {
}
User.init({
    firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: true,
<<<<<<< HEAD
    },
    role: {
        type: DataTypes.ENUM('user', 'vendor', 'admin'),
        allowNull: false,
        defaultValue: 'user'
=======
>>>>>>> 846a4ce70f29f3d00cbc77415fa1672aca86b9d1
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});
module.exports = User;