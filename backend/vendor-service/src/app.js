require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vendorRoutes = require('./routes/vendor.route');
const authRoutes = require('./routes/auth.route');

const app = express();
const port = process.env.PORT || 5006;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/vendors', vendorRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Vendor service running on port ${port}`);
});
