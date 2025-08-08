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
      return res.status(404).json({ message: "Transaction non trouvée" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Échec de la récupération de la transaction.' });
  }
};

const getTransactionsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await TransactionHistory.findAll({ where: { userId } });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "Aucune transaction trouvée pour cet utilisateur." });
    }

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions par utilisateur.' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const transactionHistory = await TransactionHistory.create(req.body);
    res.status(201).json(transactionHistory);
  } catch (err) {
    console.error('Erreur lors de la création de la transaction :', err);
    res.status(500).json({ message: "Erreur serveur, la transaction n'a pas été créée." });
  }
};

module.exports = {
  getAll,
  getTransactionById,
  getTransactionsByUserId,
  createTransaction,
};
