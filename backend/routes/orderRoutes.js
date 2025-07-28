const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', requireAuth, orderController.placeOrder);
router.get('/my', requireAuth, orderController.getUserOrders);
router.get('/all', requireAuth, role('admin'), orderController.getAllOrders);
router.put('/:id/status', requireAuth, role('admin'), orderController.updateOrderStatus);

module.exports = router; 