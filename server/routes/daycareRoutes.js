const express = require('express');
const router = express.Router();

// 1. IMPORT ALL FUNCTIONS (Including the new checkAvailability)
const { 
    getDaycarePackages, 
    createBooking, 
    updateBookingStatus, 
    getBookingStatus,
    checkAvailability // <--- Added this
} = require('../controllers/daycarePackageController');

const { protect } = require('../middleware/auth');

// --- ROUTES ---

// Feature 3: Check Availability (Public - Put this near top)
router.get('/availability', checkAvailability);

// Public: Get all packages
router.get('/', getDaycarePackages);

// Feature 1: Daycare Booking (Protected: User must be logged in)
router.post('/book', protect, createBooking);

// Feature 2: Admin History & Check-In (Protected)
router.get('/history', protect, getBookingStatus); 
router.put('/status', protect, updateBookingStatus);

module.exports = router;