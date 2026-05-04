// src/models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ingredients: [{
    name: String,
    amount: Number,
    unit: String
  }]
});

export default mongoose.model('ShoppingList', cartSchema);