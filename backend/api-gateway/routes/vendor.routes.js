const { vendorProxy } = require('../middleware/proxy');
const { checkRole } = require('../middleware/checkRole');

function vendorRoutes(app) {
  // For admin to access all vendors
  app.get('/vendors', checkRole(['admin']), vendorProxy);
  
  // For vendor-specific operations
  const vendorCheck = checkRole(['vendor', 'admin']);
  app.get('/vendors/:id', vendorProxy);
  app.post('/vendors', vendorProxy);
  app.put('/vendors/:id', vendorCheck, vendorProxy);
  app.delete('/vendors/:id', checkRole(['admin']), vendorProxy);
  
  // Product management
  app.get('/vendors/:vendorId/products', vendorProxy);
  app.post('/vendors/:vendorId/products', vendorCheck, vendorProxy);
  app.put('/vendors/:vendorId/products/:productId', vendorCheck, vendorProxy);
  app.delete('/vendors/:vendorId/products/:productId', vendorCheck, vendorProxy);
  
  // Dashboard
  app.get('/vendors/:vendorId/dashboard', vendorCheck, vendorProxy);
}

module.exports = { vendorRoutes };
