const { adminProxy } = require('../middleware/proxy');
const { checkRole } = require('../middleware/checkRole');

function adminRoutes(app) {
  // Protect all admin routes with admin role check
  const adminCheck = checkRole(['admin']);
  
  // Admin management
  app.get('/admin/admins', adminCheck, adminProxy);
  app.get('/admin/admins/:id', adminCheck, adminProxy);
  app.post('/admin/admins', adminCheck, adminProxy);
  app.put('/admin/admins/:id', adminCheck, adminProxy);
  app.delete('/admin/admins/:id', adminCheck, adminProxy);
  app.get('/admin/admins/user/:userId', adminCheck, adminProxy);
  
  // Vendor management
  app.get('/admin/vendors', adminCheck, adminProxy);
  app.put('/admin/vendors/:id', adminCheck, adminProxy);
  
  // User management
  app.get('/admin/users', adminCheck, adminProxy);
  app.put('/admin/users/:id', adminCheck, adminProxy);
  app.delete('/admin/users/:id', adminCheck, adminProxy);
  
  // Product management
  app.get('/admin/products', adminCheck, adminProxy);
  app.put('/admin/products/:id', adminCheck, adminProxy);
  
  // Dashboard
  app.get('/admin/dashboard/stats', adminCheck, adminProxy);
}

module.exports = { adminRoutes };
