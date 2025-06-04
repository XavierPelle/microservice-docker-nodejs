const { tokenProxy } = require('../middleware/proxy');

function tokenRoutes(app) {
  app.post('/verify-token', tokenProxy);
}

module.exports = { tokenRoutes };
