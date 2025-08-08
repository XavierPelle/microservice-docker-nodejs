const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/** 
* Idée numéro 1: Une transaction peut etre un Achat / Vente / Echange qui sera définie dans le transactionType. 
* Dans le cas d'un achat ou d'un vente il y aura une entrée en base de donnée.
* Dans le cas d'un échange avec un autre magasin il y aura une entrée pour le produit qui sort et une pour le produit qui rentre.
**/

class TransactionHistory extends Model {
}
TransactionHistory.init({

    idCart: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    productName: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },

    productReference: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },

    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    commandeReference: {
        type: DataTypes.STRING(30),
        allowNull: true,
    },



}, {
    sequelize,
    modelName: 'TransactionHistory',
    tableName: 'transactionHistories',
});
module.exports = TransactionHistory;