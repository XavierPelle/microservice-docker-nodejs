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
        type: DataTypes.BIGINT,
        allowNull: false,
    },

    productName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    productReference: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },

    quantity: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },

    userId: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },

    createAt: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },

    updateAt: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },

    commandeReference: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },



}, {
    sequelize,
    modelName: 'TransactionHistory',
    tableName: 'transactionHistories',
});
module.exports = TransactionHistory;