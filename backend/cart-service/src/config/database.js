"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbHost = process.env.DB_HOST || '';
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || '';
const sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
});
sequelize.sync({ force: false })
    .then(() => {
    console.log('La base de données et la table sont synchronisées et recréées à chaque démarrage.');
})
    .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
});
exports.default = sequelize;
