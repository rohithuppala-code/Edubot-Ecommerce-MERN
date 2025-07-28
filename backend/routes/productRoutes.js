const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', requireAuth, role('admin'), productController.createProduct);
router.put('/:id', requireAuth, role('admin'), productController.updateProduct);
router.delete('/:id', requireAuth, role('admin'), productController.deleteProduct);

module.exports = router; 