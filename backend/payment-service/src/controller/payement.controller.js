const Payement = require("../models/Payement");
const axios = require('axios');

 const createPayment = async (req, res) => {
    try {
        const { user_id, amount, method } = req.body;
        const payment = await Payement.create({ user_id, amount, method });

        console.log(payment)
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du paiement' });
    }
};

 const getPaymentsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const payments = await Payement.findAll({ where: { user_id } });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des paiements' });
    }
};

module.exports = {
    createPayment,
    getPaymentsByUser
};      