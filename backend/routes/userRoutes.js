const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const role = require('../middleware/role');
const cartController = require('../controllers/cartController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', requireAuth, userController.getProfile);
router.get('/all', requireAuth, role('admin'), userController.getAllUsers);
router.put('/:userId/role', requireAuth, role('admin'), userController.updateUserRole);

router.get('/cart', requireAuth, cartController.getCart);
router.post('/cart', requireAuth, cartController.addOrUpdateCartItem);
router.delete('/cart/:productId', requireAuth, cartController.removeCartItem);
router.delete('/cart', requireAuth, cartController.clearCart);

module.exports = router; 