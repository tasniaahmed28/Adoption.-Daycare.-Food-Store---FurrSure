require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Import routes
const daycareRoutes = require('./routes/daycareRoutes'); 
const petRoutes = require('./routes/petRoutes.js');
const adoptionRoutes = require('./routes/adoptionRoutes.js');
const adminRoutes = require('./routes/adminRoutes'); // ✅ IMPORT
const authRoutes = require('./routes/auth'); // Assuming this exists
const orderRoutes = require('./routes/order.routes'); // Import order routes


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🐾 Pet Adoption API is running!' });
});

// ✅ CRITICAL: Register ALL routes (ADD THESE LINES)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // ✅ ADD THIS LINE - NOT A COMMENT!
app.use('/api/daycare', daycareRoutes); 
app.use('/api/foods', require('./routes/foodRoutes'));  
app.use('/api/pets', petRoutes);
app.use('/api/adoption-requests', adoptionRoutes);
app.use('/api/orders', orderRoutes);


// Database connection & Server Listener Logic
const MONGODB_URI = process.env.MONGODB_URI; 
const PORT = process.env.PORT || 5000;

// Connect to DB and start listener only if successful
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Access at: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });