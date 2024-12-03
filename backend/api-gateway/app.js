const express = require('express');
const cors = require('cors');
const { userRoutes } = require('./routes/user.routes');
const { productRoutes } = require('./routes/product.routes');
const { transactionHistoryRoutes } = require('./routes/transactionHistory.route');
const { authRoutes } = require('./routes/auth.route');
const { promotionRoutes } = require('./routes/promotion.routes');

const app = express();
const port = 5000;
app.use(cors())
app.use(express.json());

userRoutes(app); 
productRoutes(app);
transactionHistoryRoutes(app);
authRoutes(app);
promotionRoutes(app);

app.get('/', (req, res) => res.send('Gateway API'));
app.listen(port, () => console.log(`api-gateway listening on port ${port}!`));
