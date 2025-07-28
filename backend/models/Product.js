const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  lowStockThreshold: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 