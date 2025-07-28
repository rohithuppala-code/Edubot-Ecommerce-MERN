const CartItem = require('../models/CartItem');

// Get all cart items for the logged-in user
exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.user.id }).populate('productId');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add or update a cart item for the user
exports.addOrUpdateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let item = await CartItem.findOne({ userId: req.user.id, productId });
    if (item) {
      item.quantity = quantity;
      await item.save();
    } else {
      item = await CartItem.create({ userId: req.user.id, productId, quantity });
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove a cart item for the user
exports.removeCartItem = async (req, res) => {
  try {
    await CartItem.deleteOne({ userId: req.user.id, productId: req.params.productId });
    res.json({ message: 'Cart item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear all cart items for the user
exports.clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 