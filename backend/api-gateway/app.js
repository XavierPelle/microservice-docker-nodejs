const express = require('express');
const { userRoutes } = require('./routes/user.routes');
const { productRoutes } = require('./routes/product.routes');

const app = express();
const port = 5000;

userRoutes(app); 
productRoutes(app);

app.get('/', (req, res) => res.send('Gateway API'));

app.listen(port, () => console.log(`api-gateway listening on port ${port}!`));
