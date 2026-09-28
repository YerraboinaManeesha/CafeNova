const mongoose = require('mongoose');

// One document per individual message (customer OR admin), not per Q&A pair.
// A customer's full "conversation" is simply every message sharing their
// customer ID, ordered by createdAt — no separate Conversation collection needed.
const contactMessageSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true, trim: true },
    sender: { type: String, enum: ['customer', 'admin'], required: true },
    text: { type: String, required: true, trim: true },
    // Independent read flags — a customer message is automatically "read by
    // the customer" (they wrote it) but starts unread for admin, and vice versa.
    readByCustomer: { type: Boolean, default: false },
    readByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contactMessageSchema.index({ customer: 1, createdAt: 1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);