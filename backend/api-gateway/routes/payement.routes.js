const { payementProxy } = require('../middleware/proxy');

function payementRoutes(app) {
    app.post('/payement', payementProxy);
    app.get('/payement/user/:user_id', payementProxy);
}

module.exports = { payementRoutes };
