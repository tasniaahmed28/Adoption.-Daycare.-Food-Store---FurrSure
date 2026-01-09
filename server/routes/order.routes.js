const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');  // Import the order controller

// POST: Place an order (Using the controller)
router.post('/checkout', orderController.createOrder);  // Use the createOrder function from the controller

module.exports = router;
