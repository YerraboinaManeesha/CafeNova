const ContactMessage = require('../models/ContactMessage');
const Customer = require('../models/Customer');

// ============ CUSTOMER SIDE ============

// @route  POST /api/contact
// @access Private (logged-in customer)
// Sends a message into the customer's ONE persistent conversation.
// No "create vs append" branching needed — every message just carries the
// customer's ID, so the first message IS the start of their conversation,
// and every later message automatically joins the same thread.
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const saved = await ContactMessage.create({
      customer: req.customer._id,
      customerName: req.customer.name,
      sender: 'customer',
      text: text.trim(),
      readByCustomer: true, // they just wrote it
      readByAdmin: false,
    });

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/contact/mine
// @access Private (logged-in customer)
// Returns the customer's full conversation AND marks every unread admin
// reply as read-by-customer, since opening the chat screen is what
// "reading" the reply means. This is the single source both entry points
// (Contact -> View Conversation, and Profile -> Messages) call.
const getMyConversation = async (req, res, next) => {
  try {
    await ContactMessage.updateMany(
      { customer: req.customer._id, sender: 'admin', readByCustomer: false },
      { readByCustomer: true }
    );

    const messages = await ContactMessage.find({ customer: req.customer._id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/contact/unread-count
// @access Private (logged-in customer)
// Read-only peek for the profile icon badge — does NOT mark anything as
// read, so the badge stays accurate until the customer actually opens chat.
const getMyUnreadCount = async (req, res, next) => {
  try {
    const count = await ContactMessage.countDocuments({
      customer: req.customer._id,
      sender: 'admin',
      readByCustomer: false,
    });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/contact/mine
// @access Private (logged-in customer)
// Permanently deletes the customer's ENTIRE conversation (both their own
// messages and any admin replies). This also removes it from the admin's
// Customers/Messages view, since there is nothing left to aggregate.
const clearMyConversation = async (req, res, next) => {
  try {
    await ContactMessage.deleteMany({ customer: req.customer._id });
    res.json({ message: 'Conversation cleared' });
  } catch (err) {
    next(err);
  }
};

// ============ ADMIN SIDE ============

// @route  GET /api/admin/messages
// @access Private (admin)
// Returns one row per customer conversation: latest message preview/time
// and that customer's individual unread count, sorted most-recent-first.
const getConversationsList = async (req, res, next) => {
  try {
    const conversations = await ContactMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$customer',
          customerName: { $first: '$customerName' },
          lastMessage: { $first: '$text' },
          lastSender: { $first: '$sender' },
          lastMessageTime: { $first: '$createdAt' },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    // Unread-by-admin count per customer, computed separately then merged in
    // (cleaner than a second $group stage on the same pipeline).
    const unreadCounts = await ContactMessage.aggregate([
      { $match: { sender: 'customer', readByAdmin: false } },
      { $group: { _id: '$customer', unread: { $sum: 1 } } },
    ]);
    const unreadMap = {};
    unreadCounts.forEach((u) => { unreadMap[u._id.toString()] = u.unread; });

    const result = conversations.map((c) => ({
      customerId: c._id,
      customerName: c.customerName,
      lastMessage: c.lastMessage,
      lastSender: c.lastSender,
      lastMessageTime: c.lastMessageTime,
      unreadCount: unreadMap[c._id.toString()] || 0,
    }));

    const totalUnread = result.reduce((sum, c) => sum + c.unreadCount, 0);

    res.json({ conversations: result, totalUnread });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/messages/:customerId
// @access Private (admin)
// Opens one customer's thread and marks THEIR unread customer-sent messages
// as read-by-admin only — other customers' counts are untouched.
const getConversationByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    await ContactMessage.updateMany(
      { customer: customerId, sender: 'customer', readByAdmin: false },
      { readByAdmin: true }
    );

    const messages = await ContactMessage.find({ customer: customerId }).sort({ createdAt: 1 });
    if (!messages.length) {
      return res.status(404).json({ message: 'No conversation found for this customer' });
    }

    const customerDoc = await Customer.findById(customerId).select('email');

    res.json({
      customerId,
      customerName: messages[0].customerName,
      customerEmail: customerDoc ? customerDoc.email : '',
      messages,
    });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/admin/messages/:customerId/reply
// @access Private (admin)
const replyToCustomer = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    // Pull the customer's name from their own most recent message
    const lastMsg = await ContactMessage.findOne({ customer: req.params.customerId }).sort({ createdAt: -1 });
    if (!lastMsg) {
      return res.status(404).json({ message: 'No conversation found for this customer' });
    }

    const saved = await ContactMessage.create({
      customer: req.params.customerId,
      customerName: lastMsg.customerName,
      sender: 'admin',
      text: text.trim(),
      readByAdmin: true, // admin just wrote it
      readByCustomer: false,
    });

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/admin/messages/:customerId
// @access Private (admin)
// Permanently deletes the ENTIRE conversation with that customer — both
// sides, from MongoDB. This also removes it from the customer's own
// Messages view, since there is nothing left to show.
const deleteConversation = async (req, res, next) => {
  try {
    await ContactMessage.deleteMany({ customer: req.params.customerId });
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getMyConversation,
  getMyUnreadCount,
  clearMyConversation,
  getConversationsList,
  getConversationByCustomer,
  replyToCustomer,
  deleteConversation,
};