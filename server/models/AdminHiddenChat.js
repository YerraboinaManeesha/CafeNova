const mongoose = require('mongoose');

// Tracks which customer conversations the admin has "deleted" (hidden) from
// their Customers/Messages view. This never touches ContactMessage — the
// customer's own conversation is completely unaffected. If the customer
// sends a new message after being hidden, the conversation reappears for
// admin automatically (see getConversationsList in contactController.js).
const adminHiddenChatSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminHiddenChat', adminHiddenChatSchema);