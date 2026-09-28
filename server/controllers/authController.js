const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// @route  POST /api/login
// @access Public — single entry point for both customers and admin
const unifiedLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const lowerEmail = email.toLowerCase();

    // Check customer accounts first (far more common case)
    const customer = await Customer.findOne({ email: lowerEmail });
    if (customer && (await customer.matchPassword(password))) {
      return res.json({
        role: 'customer',
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id),
      });
    }

    // Fall back to checking the admin account
    const admin = await Admin.findOne({ email: lowerEmail });
    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        role: 'admin',
        email: admin.email,
        token: generateToken(admin._id),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (err) {
    next(err);
  }
};

module.exports = { unifiedLogin };