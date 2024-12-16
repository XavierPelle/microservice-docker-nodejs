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
              productReference: product.productReference,
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
            productReference: product.productReference,
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

const createFakeProduct = async (req, res) => {
  try { 
    const productsData = [
      { name: 'Smartphone X', description: 'Téléphone haut de gamme avec caméra 108MP', price: 999.99, productReference: 'SP-X-001' },
      { name: 'Laptop Pro', description: 'Ordinateur portable pour professionnels', price: 1499.99, productReference: 'LP-PRO-002' },
      { name: 'Casque audio sans fil', description: 'Casque Bluetooth avec réduction de bruit', price: 249.99, productReference: 'CA-BT-003' },
      { name: 'Montre connectée', description: 'Smartwatch avec suivi fitness', price: 199.99, productReference: 'MC-FIT-004' },
      { name: 'Tablette Ultra', description: 'Tablette fine et légère avec écran 4K', price: 699.99, productReference: 'TU-4K-005' },
      { name: 'Smartphone Y', description: 'Téléphone milieu de gamme avec triple caméra', price: 599.99, productReference: 'SP-Y-006' },
      { name: 'Laptop Étudiant', description: 'Ordinateur portable abordable pour étudiants', price: 799.99, productReference: 'LP-ETU-007' },
      { name: 'Écouteurs Sport', description: 'Écouteurs sans fil résistants à l\'eau', price: 129.99, productReference: 'ES-SP-008' },
      { name: 'Bracelet Fitness', description: 'Bracelet connecté avec moniteur cardiaque', price: 79.99, productReference: 'BF-HR-009' },
      { name: 'Tablette Mini', description: 'Tablette compacte de 8 pouces', price: 399.99, productReference: 'TM-8-010' },
      { name: 'Smartphone Z', description: 'Téléphone pliable avec écran AMOLED', price: 1299.99, productReference: 'SP-Z-011' },
      { name: 'Laptop Gaming', description: 'Ordinateur portable pour jeux haute performance', price: 1999.99, productReference: 'LP-GAM-012' },
      { name: 'Casque VR', description: 'Casque de réalité virtuelle immersif', price: 399.99, productReference: 'CV-RV-013' },
      { name: 'Montre Luxe', description: 'Smartwatch en acier inoxydable', price: 349.99, productReference: 'ML-LUX-014' },
      { name: 'Tablette Pro', description: 'Tablette professionnelle avec stylet', price: 899.99, productReference: 'TP-STY-015' },
      { name: 'Smartphone Eco', description: 'Téléphone écologique et durable', price: 449.99, productReference: 'SP-ECO-016' },
      { name: 'Laptop Convertible', description: 'Ordinateur portable 2-en-1 tactile', price: 1299.99, productReference: 'LP-CONV-017' },
      { name: 'Enceinte Bluetooth', description: 'Enceinte portable waterproof', price: 89.99, productReference: 'EB-WP-018' },
      { name: 'Montre Enfant', description: 'Smartwatch pour enfants avec GPS', price: 149.99, productReference: 'ME-GPS-019' },
      { name: 'Tablette Éducative', description: 'Tablette robuste pour enfants', price: 199.99, productReference: 'TE-KID-020' },
      { name: 'Smartphone Senior', description: 'Téléphone simplifié pour seniors', price: 299.99, productReference: 'SP-SEN-021' },
      { name: 'Laptop Ultrabook', description: 'Ordinateur portable ultra-fin et léger', price: 1099.99, productReference: 'LP-ULT-022' },
      { name: 'Casque Gaming', description: 'Casque audio surround pour gamers', price: 179.99, productReference: 'CG-SUR-023' },
      { name: 'Montre Sport', description: 'Smartwatch résistante pour sportifs', price: 249.99, productReference: 'MS-SPO-024' },
      { name: 'Tablette Graphique', description: 'Tablette pour artistes et designers', price: 599.99, productReference: 'TG-ART-025' },
      { name: 'Smartphone Rugged', description: 'Téléphone ultra-résistant pour conditions extrêmes', price: 799.99, productReference: 'SP-RUG-026' },
      { name: 'Laptop Workstation', description: 'Station de travail mobile pour professionnels', price: 2499.99, productReference: 'LP-WS-027' },
      { name: 'Écouteurs True Wireless', description: 'Écouteurs sans fil avec boîtier de charge', price: 159.99, productReference: 'ETW-CH-028' },
      { name: 'Montre Hybride', description: 'Montre analogique avec fonctions smart', price: 299.99, productReference: 'MH-ANA-029' },
      { name: 'Tablette E-Reader', description: 'Tablette optimisée pour la lecture', price: 229.99, productReference: 'TER-INK-030' }
    ];
    for (const product of productsData) {
      await Product.create(product);
    }
    res.status(200).json({ message: "Fake products successfully created" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error: Product has not been created" });
  }
};

  module.exports = {
    getAll,
    createProduct,
    updateProduct,
    deleteProduct,
    createFakeProduct
  }