const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Get all categories
router.get('/', categoryController.getCategories);

// Create a new category (admin only)
router.post('/', requireAuth, requireAdmin, categoryController.createCategory);

// Update a category (admin only)
router.put('/:id', requireAuth, requireAdmin, categoryController.updateCategory);

// Delete a category (admin only)
router.delete('/:id', requireAuth, requireAdmin, categoryController.deleteCategory);

module.exports = router; 