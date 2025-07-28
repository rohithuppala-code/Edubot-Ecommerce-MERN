const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const category = new Category({ name, icon });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    // Delete all products with this category
    await Product.deleteMany({ category: category.name });

    res.json({ message: 'Category and its products deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 