const axios = require('axios');
const { PROMOTION_SERVICE_URL } = require('../microserviceURL/microserviceURL');

const promotionRoutes = (app) => {
  // Generate promotion code
  app.post('/api/promotions/generate', async (req, res) => {
    try {
      const response = await axios.post(`${PROMOTION_SERVICE_URL}/api/promotions/generate`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Promotion generation error:', error);
      res.status(error.response?.status || 500).json({
        message: 'Error generating promotion code',
        error: error.response?.data || 'Internal Server Error'
      });
    }
  });

  // Validate promotion code
  app.post('/api/promotions/validate', async (req, res) => {
    try {
      const response = await axios.post(`${PROMOTION_SERVICE_URL}/api/promotions/validate`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Promotion validation error:', error);
      res.status(error.response?.status || 500).json({
        message: 'Error validating promotion code',
        error: error.response?.data || 'Internal Server Error'
      });
    }
  });

  // Use promotion code
  app.post('/api/promotions/use', async (req, res) => {
    try {
      const response = await axios.post(`${PROMOTION_SERVICE_URL}/api/promotions/use`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Promotion usage error:', error);
      res.status(error.response?.status || 500).json({
        message: 'Error using promotion code',
        error: error.response?.data || 'Internal Server Error'
      });
    }
  });
};

module.exports = { promotionRoutes };
