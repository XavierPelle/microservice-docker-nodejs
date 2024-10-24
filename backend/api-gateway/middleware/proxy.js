const { createProxyMiddleware } = require('http-proxy-middleware');
const { USER_API_URL, PRODUCT_API_URL } = require('../microserviceURL/microserviceUrl');

const optionsUser = {
  target: USER_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`User Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the user service.');
  },
};

const optionsProduct = {
  target: PRODUCT_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Product Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the product service.');
  },
};

const userProxy = createProxyMiddleware(optionsUser);
const productProxy = createProxyMiddleware(optionsProduct);

module.exports = {
  userProxy,
  productProxy,
};
