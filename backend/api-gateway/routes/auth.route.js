const { authProxy } = require('../middleware/proxy');

function authRoutes(app) {
    app.post('/register', authProxy);
    app.post('/register_up', authProxy);
    app.post('/login',authProxy);
    app.post('/login_send',authProxy);
}

module.exports = { authRoutes };