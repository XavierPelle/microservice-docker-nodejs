const TransactionHistory = require("../models/TransactionHistory");

const getAll = async (req, res) => {
    try {
      const transactionHistory = await TransactionHistory.findAll();
      res.json(transactionHistory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch history.' });
    }
  };

  const getTransactionById = async (req, res) => {
    try {
        const id = req.params.id;
        const transaction = await TransactionHistory.findByPk(id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction non trouvé " });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Echecs de la recuperation de la transation..' });
    }
};

const createTransaction = async (req, res) => {
    try {
      const transactionHistory = await TransactionHistory.create(req.body);
      res.status(201).json(transactionHistory);
    } catch (err) {
      res.status(500).json({ message: "server error transaction has not been created" });
    }
  };

  module.exports = {
    getAll,
    getTransactionById,
    createTransaction,
  }