const express = require('express');
const mongoose = require('mongoose');
const promotionRoutes = require('./routes/promotionRoutes');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect('mongodb://localhost:27017/promotion-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/promotions', promotionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Promotion Service running on port ${PORT}`);
});

module.exports = app;
