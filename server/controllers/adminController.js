const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// @route  POST /api/admin/login
// @access Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/me
// @access Private (admin) — used to verify a stored token is still valid
const getAdminProfile = async (req, res) => {
  res.json(req.admin);
};

module.exports = { loginAdmin, getAdminProfile };
