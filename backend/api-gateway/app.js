const express = require('express');
const cors = require('cors');
const { userRoutes } = require('./routes/user.routes');
const { productRoutes } = require('./routes/product.routes');
const { transactionHistoryRoutes } = require('./routes/transactionHistory.route');
const { authRoutes } = require('./routes/auth.route');
const { cartRoutes } = require('./routes/cart.route');

const app = express();
const port = 5000;

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

userRoutes(app);
productRoutes(app);
transactionHistoryRoutes(app);
authRoutes(app);
cartRoutes(app);


app.get('/', (req, res) => res.send('Gateway API'));
app.listen(port, () => console.log(`api-gateway listening on port ${port}!`));
