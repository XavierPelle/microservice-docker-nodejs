require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');  
const cors = require('cors');
const productRouter = require('./routes/product.route');

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/product', productRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
