const { vendorProxy } = require('../middleware/proxy');
const { checkRole } = require('../middleware/checkRole');

function vendorRoutes(app) {
  // For admin to access all vendors
  app.get('/vendors', checkRole(['admin']), vendorProxy);
  
  // Pour récupérer un vendeur par userId
  app.get('/vendors/user/:userId', vendorProxy);

  // For vendor-specific operations
  const vendorCheck = checkRole(['vendor', 'admin']);
  app.get('/vendors/:id', vendorProxy);
  app.post('/vendors', vendorProxy);
  app.put('/vendors/:id', vendorCheck, vendorProxy);
  app.delete('/vendors/:id', checkRole(['admin']), vendorProxy);
  
  // Product management
  app.get('/vendors/:vendorId/get/products', vendorProxy);
  app.get('/vendors/product/:id', vendorProxy);
  app.post('/vendors/:vendorId/products', vendorCheck, vendorProxy);
  app.put('/vendors/:vendorId/products/:productId', vendorCheck, vendorProxy);
  app.delete('/vendors/:vendorId/products/:productId', vendorCheck, vendorProxy);
  
  // Dashboard
  app.get('/vendors/:vendorId/dashboard', vendorCheck, vendorProxy);

  // Route publique pour tous les produits de tous les vendeurs
  app.get('/vendors/products', vendorProxy);
}

module.exports = { vendorRoutes };
