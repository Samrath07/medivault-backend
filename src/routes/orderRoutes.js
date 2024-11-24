// src/routes/orderRoutes.js
const express = require('express');
const { placeOrder, getOrdersForWholesaler, updateOrderStatus } = require('../controllers/order');
const { authenticate } = require('../auth/authMiddleware');

const router = express.Router();

router.post('/', authenticate, placeOrder);

router.get('/', authenticate, getOrdersForWholesaler);

router.patch('/:orderId', authenticate, updateOrderStatus);

module.exports = router;
