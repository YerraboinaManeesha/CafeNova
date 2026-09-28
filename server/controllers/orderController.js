const Order = require('../models/Order');

function generateOrderCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BB${num}`;
}

// @route  POST /api/orders
// @access Private (customer must be logged in)
const createOrder = async (req, res, next) => {
  try {
    const { items, tableNumber } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must include at least one item' });
    }
    if (!tableNumber) {
      return res.status(400).json({ message: 'Table number is required' });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    let orderCode = generateOrderCode();
    while (await Order.findOne({ orderCode })) {
      orderCode = generateOrderCode();
    }

    const order = await Order.create({
      orderCode,
      customer: req.customer._id,
      items,
      total,
      customerName: req.customer.name,
      customerContact: tableNumber,
      status: 'pending',
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders
// @access Private (customer) — a customer's own order history
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.customer._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/orders/:orderCode
// @access Public — lets a guest check their own order status without an account
const getOrderByCode = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderCode: req.params.orderCode });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/orders
// @access Private (admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/orders/:id/status
// @access Private (admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/admin/orders/:id
// @access Private (admin)
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getOrderByCode,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};