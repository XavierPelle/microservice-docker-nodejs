const { transactionHistoryProxy } = require('../middleware/proxy');

function transactionHistoryRoutes(app) {
  app.get('/transaction-history', transactionHistoryProxy);
  app.get('/transaction-history/:id', transactionHistoryProxy);
  app.get('/transaction-history/user/:userId', transactionHistoryProxy);
  app.post('/transaction-history/create', transactionHistoryProxy);
}

module.exports = { transactionHistoryRoutes };
