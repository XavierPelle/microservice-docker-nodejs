const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vendorRoutes = require('./routes/vendor.routes');

const app = express();
const port = process.env.PORT || 5006;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/vendors', vendorRoutes);

app.listen(port, () => {
    console.log(`Vendor Service running on port ${port}`);
});
