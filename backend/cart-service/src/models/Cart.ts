import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database';

class Cart extends Model {}

Cart.init({
    id_cart: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    productReference: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER(),
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
});

export default Cart;
