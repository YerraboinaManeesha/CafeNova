const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['coffee', 'tea', 'pastry', 'sandwich', 'other'],
      default: 'coffee',
    },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
