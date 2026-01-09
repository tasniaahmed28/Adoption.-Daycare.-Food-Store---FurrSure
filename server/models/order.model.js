const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user placing the order
  items: [
    {
      productId: String,   // ID of the product
      name: String,        // Name of the product
      price: Number,       // Price of the product
      quantity: Number,    // Quantity of the product
    }
  ],
  totalCost: Number,        // Total cost of the items in the cart
  shippingAddress: {
    name: String,           // Name of the user
    address: String,        // Shipping address
    phone: String,          // User's phone number
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' },  // Payment method (COD)
  status: { type: String, default: 'Pending' },  // Order status
  createdAt: { type: Date, default: Date.now }  // Timestamp when the order is placed
});

module.exports = mongoose.model('Order', orderSchema);