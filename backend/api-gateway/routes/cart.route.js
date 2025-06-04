const { cartProxy } = require('../middleware/proxy');

function cartRoutes(app) {
  app.get('/cart', cartProxy);
  app.get('/cart/find/:id', cartProxy);
  app.post('/cart/create', cartProxy);
  app.put('/cart/update/:id', cartProxy);
  app.delete('/cart/delete/:id', cartProxy);
}

module.exports = { cartRoutes };
