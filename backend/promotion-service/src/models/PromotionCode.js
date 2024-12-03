const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PromotionCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4().substring(0, 8).toUpperCase()
  },
  userId: {
    type: String,
    required: true
  },
  purchaseCount: {
    type: Number,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from creation
  },
  discountPercentage: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

module.exports = mongoose.model('PromotionCode', PromotionCodeSchema);
