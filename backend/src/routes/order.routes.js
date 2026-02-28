const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, trackOrder } = require('../controllers/order.controller');
const { protect, optionalProtect, restrictTo } = require('../middleware/auth.middleware');

router.post('/track', trackOrder);                     // public — order tracking
router.post('/', optionalProtect, createOrder);        // guests + logged-in users
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, restrictTo('admin'), getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, restrictTo('admin'), updateOrderStatus);

module.exports = router;
