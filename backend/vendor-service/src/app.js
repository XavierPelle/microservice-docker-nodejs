require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vendorRoutes = require('./routes/vendor.route');
const authRoutes = require('./routes/auth.route');
const sequelize = require('./config/database');

// Import des modèles pour la synchronisation
require('./models/VendorUser');
require('./models/Vendor');
require('./models/Product');

const app = express();
const port = process.env.PORT || 5006;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/vendors', vendorRoutes);
app.use('/auth', authRoutes);

// Synchronisation des modèles Sequelize avant de démarrer le serveur
sequelize.sync().then(() => {
app.listen(port, () => {
    console.log(`Vendor service running on port ${port}`);
  });
}).catch((err) => {
  console.error('Erreur lors de la synchronisation des modèles Sequelize :', err);
});