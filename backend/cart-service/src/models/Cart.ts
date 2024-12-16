import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database';

class Cart extends Model {}

Cart.init({
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
}, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
});

export default Cart;
