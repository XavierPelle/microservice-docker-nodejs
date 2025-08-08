require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');  
const cors = require('cors');
const transactionHistory = require('./routes/transaction-history.route');

const app = express();
const port = process.env.PORT || 5003;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/transaction-history', transactionHistory);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
