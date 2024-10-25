const { transactionHistoryProxy } = require('../middleware/proxy');

function transactionHistoryRoutes(app) {
  app.get('/transaction-history', transactionHistoryProxy);
}

module.exports = { transactionHistoryRoutes };
