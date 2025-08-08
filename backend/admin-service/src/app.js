require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/admin.route');

const app = express();
const port = process.env.PORT || 5007;

app.use(cors());
app.use(bodyParser.json());

app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Admin service running on port ${port}`);
});