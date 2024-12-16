import { Sequelize } from 'sequelize';

const dbHost: string = process.env.DB_HOST || '';
const dbUser: string = process.env.DB_USER || '';
const dbPassword: string = process.env.DB_PASSWORD || '';
const dbName: string = process.env.DB_NAME || '';

const sequelize: Sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'postgres',
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('La base de données et la table sont synchronisées et recréées à chaque démarrage.');
  })
  .catch((error: Error) => {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
  });

export default sequelize;
