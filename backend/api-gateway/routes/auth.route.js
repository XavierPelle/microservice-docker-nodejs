const { authProxy } = require('../middleware/proxy');

function authRoutes(app) {
    app.post('/register', authProxy);
    app.post('/login',authProxy);
}

module.exports = { authRoutes };