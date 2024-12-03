const express = require('express');
const router = express.Router();
const PromotionCode = require('../models/PromotionCode');
const axios = require('axios');

// Generate promotion code for a user
router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user's purchase count from transaction history service
    const transactionResponse = await axios.get(`http://transaction-history-service/api/transactions/count/${userId}`);
    const purchaseCount = transactionResponse.data.count;

    // Check if user qualifies for promotion code
    if (purchaseCount > 100) {
      // Check if user already has an unused promotion code
      const existingCode = await PromotionCode.findOne({ 
        userId, 
        isUsed: false, 
        expiresAt: { $gt: new Date() } 
      });

      if (existingCode) {
        return res.status(200).json(existingCode);
      }

      // Create new promotion code
      const promotionCode = new PromotionCode({
        userId,
        purchaseCount,
        discountPercentage: calculateDiscount(purchaseCount)
      });

      await promotionCode.save();

      res.status(201).json(promotionCode);
    } else {
      res.status(400).json({ 
        message: 'User does not qualify for a promotion code' 
      });
    }
  } catch (error) {
    console.error('Error generating promotion code:', error);
    res.status(500).json({ 
      message: 'Error generating promotion code',
      error: error.message 
    });
  }
});

// Validate promotion code
router.post('/validate', async (req, res) => {
  try {
    const { code, userId } = req.body;

    const promotionCode = await PromotionCode.findOne({ 
      code, 
      userId,
      isUsed: false,
      expiresAt: { $gt: new Date() } 
    });

    if (promotionCode) {
      res.status(200).json({ 
        valid: true, 
        discountPercentage: promotionCode.discountPercentage 
      });
    } else {
      res.status(404).json({ 
        valid: false, 
        message: 'Invalid or expired promotion code' 
      });
    }
  } catch (error) {
    console.error('Error validating promotion code:', error);
    res.status(500).json({ 
      message: 'Error validating promotion code',
      error: error.message 
    });
  }
});

// Mark promotion code as used
router.post('/use', async (req, res) => {
  try {
    const { code, userId } = req.body;

    const promotionCode = await PromotionCode.findOneAndUpdate(
      { 
        code, 
        userId,
        isUsed: false,
        expiresAt: { $gt: new Date() } 
      },
      { isUsed: true },
      { new: true }
    );

    if (promotionCode) {
      res.status(200).json({ 
        message: 'Promotion code used successfully',
        discountPercentage: promotionCode.discountPercentage 
      });
    } else {
      res.status(404).json({ 
        message: 'Invalid or already used promotion code' 
      });
    }
  } catch (error) {
    console.error('Error using promotion code:', error);
    res.status(500).json({ 
      message: 'Error using promotion code',
      error: error.message 
    });
  }
});

// Helper function to calculate discount based on purchase count
function calculateDiscount(purchaseCount) {
  // Tiered discount system
  if (purchaseCount > 1000) return 25;
  if (purchaseCount > 500) return 20;
  if (purchaseCount > 250) return 15;
  return 10;
}

module.exports = router;
