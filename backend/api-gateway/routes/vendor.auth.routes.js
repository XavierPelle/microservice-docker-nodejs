const { vendorProxy } = require('../middleware/proxy');

function vendorAuthRoutes(app) {
  app.post('/auth/register', vendorProxy);
  app.post('/auth/register-complete', vendorProxy);
  app.post('/auth/login-send', vendorProxy);
  app.post('/auth/login', vendorProxy);
  app.post('/auth/verify-token', vendorProxy);
}

module.exports = { vendorAuthRoutes };
