const { createProxyMiddleware } = require('http-proxy-middleware');
const { USER_API_URL } = require('../microserviceURL/microserviceUrl');

const optionsUser = {
  target: USER_API_URL,
  changeOrigin: true,
  logger: console,
};

const userProxy = createProxyMiddleware(optionsUser);

module.exports = userProxy;
