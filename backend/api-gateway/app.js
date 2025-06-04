const express = require('express');
const cors = require('cors');
const { userRoutes } = require('./routes/user.routes');
const { productRoutes } = require('./routes/product.routes');
const { transactionHistoryRoutes } = require('./routes/transactionHistory.route');
const { authRoutes } = require('./routes/auth.route');
const { cartRoutes } = require('./routes/cart.route');
const { tokenRoutes } = require('./routes/token.route');
<<<<<<< HEAD
const { adminRoutes } = require('./routes/admin.routes');
const { vendorRoutes } = require('./routes/vendor.routes');
=======
>>>>>>> 846a4ce70f29f3d00cbc77415fa1672aca86b9d1

const app = express();
const port = 5000;

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
<<<<<<< HEAD
app.use(express.json());

// Register all routes
=======

>>>>>>> 846a4ce70f29f3d00cbc77415fa1672aca86b9d1
userRoutes(app);
productRoutes(app);
transactionHistoryRoutes(app);
authRoutes(app);
cartRoutes(app);
tokenRoutes(app);
<<<<<<< HEAD
adminRoutes(app);
vendorRoutes(app);
=======

>>>>>>> 846a4ce70f29f3d00cbc77415fa1672aca86b9d1

app.get('/', (req, res) => res.send('Gateway API'));
app.listen(port, () => console.log(`api-gateway listening on port ${port}!`));
