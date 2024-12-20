const { transactionHistoryProxy } = require('../middleware/proxy');

function transactionHistoryRoutes(app) {
  app.get('/transaction-history', transactionHistoryProxy);
  app.get('/transaction-history/:id', transactionHistoryProxy);
}

module.exports = { transactionHistoryRoutes };
