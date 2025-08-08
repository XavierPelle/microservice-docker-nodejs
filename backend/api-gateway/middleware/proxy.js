const { createProxyMiddleware } = require('http-proxy-middleware');
const { PAYEMENT_API_URL, USER_API_URL, PRODUCT_API_URL, TRANSACTION_HISTOY_API_URL, AUTH_API_URL, CART_API_URL, TOKEN_API_URL, ADMIN_API_URL, VENDOR_API_URL } = require('../microserviceURL/microserviceUrl');

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
    res.status(500).send('Something went wrong with the Cart service.');
  },
};

const optionsToken = {
  target: TOKEN_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Token Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the TOken service.');
  },
};

const optionsAdmin = {
  target: ADMIN_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Admin Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the admin service.');
  },
};

const optionsVendor = {
  target: VENDOR_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Vendor Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the vendor service.');
  },
};

const optionsPayement = {
  target: PAYEMENT_API_URL,
  changeOrigin: true,
  logger: console,
  onError: (err, req, res) => {
    console.error(`Payement Proxy Error: ${err.message}`);
    res.status(500).send('Something went wrong with the payement service.');
  },
};

const userProxy = createProxyMiddleware(optionsUser);
const productProxy = createProxyMiddleware(optionsProduct);
const transactionHistoryProxy = createProxyMiddleware(optionsTransactionHistory);
const authProxy = createProxyMiddleware(optionsAuth);
const cartProxy = createProxyMiddleware(optionsCart);
const tokenProxy = createProxyMiddleware(optionsToken);
const adminProxy = createProxyMiddleware(optionsAdmin);
const vendorProxy = createProxyMiddleware(optionsVendor);
const payementProxy = createProxyMiddleware(optionsPayement);

module.exports = {
  userProxy,
  productProxy,
  transactionHistoryProxy,
  authProxy,
  cartProxy,
  tokenProxy,
  adminProxy,
  vendorProxy,
  payementProxy
};