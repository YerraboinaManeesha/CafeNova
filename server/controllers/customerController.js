const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// @route  POST /api/customers/register
// @access Public
const registerCustomer = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const customer = await Customer.create({ name, email, password });
    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      message: 'Account created. Please sign in.',
    });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/customers/login
// @access Public
const loginCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer || !(await customer.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      token: generateToken(customer._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/customers/me
// @access Private (customer)
const getCustomerProfile = async (req, res) => {
  res.json(req.customer);
};

module.exports = { registerCustomer, loginCustomer, getCustomerProfile };