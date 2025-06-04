const { productProxy } = require('../middleware/proxy');

function productRoutes(app) {
  app.get('/product', productProxy);
  app.post('/product/create', productProxy);
  app.put('/product/update/:id', productProxy);
  app.delete('/product/delete/:id', productProxy);
  app.get('/product/fakedata', productProxy); 
  app.get('/product/:id', productProxy);
}

module.exports = { productRoutes };
