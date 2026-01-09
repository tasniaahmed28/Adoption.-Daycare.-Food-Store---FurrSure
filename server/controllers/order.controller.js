const mongoose = require('mongoose');
const Order = require('../models/order.model');  // Import Order model

// Controller to handle order creation
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalCost, shippingAddress, paymentMethod } = req.body;

    // Convert userId to ObjectId
    const convertedUserId = mongoose.Types.ObjectId(userId);  // Convert to ObjectId

    // Create a new order instance
    const newOrder = new Order({
      userId: convertedUserId,  // Reference to the user placing the order
      items,   // List of items in the cart
      totalCost,  // Total cost of the items
      shippingAddress,  // Shipping information
      paymentMethod,  // Payment method (Cash on Delivery)
      status: 'Pending',  // Order status
      createdAt: new Date(),  // Timestamp of order creation
    });

    // Save the new order in the database
    const savedOrder = await newOrder.save();
    
    // Return the saved order as a response
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};
