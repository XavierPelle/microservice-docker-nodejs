const userProxy = require('../middleware/proxy');

function userRoutes(app) {
  app.get('/users', userProxy);
  app.post('/users/create', userProxy);
  app.put('/users/update/:id', userProxy);
  app.delete('/users/delete/:id', userProxy);
}

module.exports = { userRoutes };
