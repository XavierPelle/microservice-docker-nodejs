const Product = require("../models/Product");
const { TRANSACTION_HISTOY_API_URL } = require('../microserviceURL/microserviceUrl');
const axios = require('axios');

const getAll = async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch Products.' });
    }
  };

  const createProduct = async (req, res) => {
      try {
          const product = await Product.create(req.body);
          const data = {
              transactionType: "Achat",
              productId: product.id,
              productName: req.body.name,
              price: req.body.price,
          };
          await axios.post(`${TRANSACTION_HISTOY_API_URL}/transaction-history/create`, data);
          res.status(201).json(product);
      } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error: Product has not been created" });
      }
  };
  

const updateProduct = async (req, res) => {
  try {
      const id = req.params.id;
      await Product.update(req.body, { where: { id: id } });
      res.status(200).json({ message: "Product updated !" });
    } catch (err) {
      res.status(500).json({ message: "server error the Product has not been updated !" });
    }
  };

  const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const data = {
            transactionType: "Vente",
            productId: product.id,
            productName: product.name,
            price: product.price,
        };
        await axios.post(`${TRANSACTION_HISTOY_API_URL}/transaction-history/create`, data);
        await Product.destroy({ where: { id: id } });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: Product could not be deleted" });
    }
};

  module.exports = {
    getAll,
    createProduct,
    updateProduct,
    deleteProduct,
  }