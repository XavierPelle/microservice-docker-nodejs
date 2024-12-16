const { createProxyMiddleware } = require('http-proxy-middleware');
const { USER_API_URL, PRODUCT_API_URL, TRANSACTION_HISTOY_API_URL, AUTH_API_URL, CART_API_URL } = require('../microserviceURL/microserviceUrl');

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

const optionsTransactionHistory = {
  target: TRANSACTION_HISTOY_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Transaction history Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the transaction history service.');
  },
};

const optionsAuth = {
  target: AUTH_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Auth Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the Auth service.');
  },
};

const optionsCart = {
  target: CART_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Cart Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the Auth service.');
  },
};

const userProxy = createProxyMiddleware(optionsUser);
const productProxy = createProxyMiddleware(optionsProduct);
const transactionHistoryProxy = createProxyMiddleware(optionsTransactionHistory);
const authProxy = createProxyMiddleware(optionsAuth);
const cartProxy = createProxyMiddleware(optionsCart);

module.exports = {
  userProxy,
  productProxy,
  transactionHistoryProxy,
  authProxy,
  cartProxy
};