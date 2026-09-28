const MenuItem = require('../models/MenuItem');

// @route  GET /api/menu
// @access Public
const getMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ available: true }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/admin/menu
// @access Private (admin)
const createMenuItem = async (req, res, next) => {
  try {
    const { name, price, category, image, description } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const item = await MenuItem.create({ name, price, category, image, description });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// @route  PUT /api/admin/menu/:id
// @access Private (admin)
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    Object.assign(item, req.body);
    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @route  DELETE /api/admin/menu/:id
// @access Private (admin)
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    await item.deleteOne();
    res.json({ message: 'Menu item removed' });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/admin/menu
// @access Private (admin) — includes unavailable items
const getAllMenuItemsAdmin = async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItemsAdmin,
};
