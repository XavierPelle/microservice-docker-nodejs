const express = require('express');
const cors = require('cors');
const { userRoutes } = require('./routes/user.routes');
const { productRoutes } = require('./routes/product.routes');
const { transactionHistoryRoutes } = require('./routes/transactionHistory.route');
const { authRoutes } = require('./routes/auth.route');
const { cartRoutes } = require('./routes/cart.route');
const { tokenRoutes } = require('./routes/token.route');
const { adminRoutes } = require('./routes/admin.routes');
const { vendorRoutes } = require('./routes/vendor.routes');
const { vendorAuthRoutes } = require('./routes/vendor.auth.routes');
const { payementRoutes } = require('./routes/payement.routes');


const app = express();
const port = 5000;

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Register all routes
userRoutes(app);
productRoutes(app);
transactionHistoryRoutes(app);
authRoutes(app);
cartRoutes(app);
tokenRoutes(app);
adminRoutes(app);
vendorRoutes(app);
vendorAuthRoutes(app);
payementRoutes(app);

app.get('/', (req, res) => res.send('Gateway API'));
app.listen(port, () => console.log(`api-gateway listening on port ${port}!`));
