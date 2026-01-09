const DaycarePackage = require('../models/DaycarePackage');
const DaycareBooking = require('../models/DaycareBooking');

// --- Sprint 1: Packages ---
const getDaycarePackages = async (req, res) => {
    try {
        const packages = await DaycarePackage.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, message: 'Retrieved successfully', data: packages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const createDaycarePackage = async (req, res) => {
    try {
        const { name, description, price, duration, features } = req.body;
        const daycarePackage = await DaycarePackage.create({ name, description, price, duration, features });
        res.status(201).json({ success: true, data: daycarePackage });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// --- Sprint 2: Feature 1 - Booking ---
const createBooking = async (req, res) => {
    try {
        const { petName, packageId, bookingDate } = req.body;
        
        // Availability Check specifically for the requested date
        const bookingCount = await DaycareBooking.countDocuments({ 
            bookingDate: bookingDate, 
            status: { $ne: 'Cancelled' } 
        });

        if (bookingCount >= 10) {
            return res.status(400).json({ message: "Sorry, Daycare is full for this specific date." });
        }

        const newBooking = new DaycareBooking({
            user: req.user ? req.user.id : null, // Handles authenticated user
            petName,
            package: packageId,
            bookingDate
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Sprint 2: Feature 2 - Check-In / Check-Out Logic ---
const updateBookingStatus = async (req, res) => {
    try {
        const { id, status } = req.body; 
        
        // 1. Find the booking document first
        const booking = await DaycareBooking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // 2. Update the status
        booking.status = status;

        // 3. Set the time explicitly based on the new status
        if (status === 'Checked-In') {
            booking.checkInTime = new Date(); // Saves current server time
        } else if (status === 'Checked-Out') {
            booking.checkOutTime = new Date(); // Saves current server time
        }

        // 4. Save changes to MongoDB
        await booking.save();

        res.status(200).json({
            success: true,
            message: `Pet status updated to ${status}`,
            data: booking
        });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getBookingStatus = async (req, res) => {
    try {
        const bookings = await DaycareBooking.find()
            .populate('package', 'name price')
            .populate('user', 'name email')
            .sort({ bookingDate: -1 });
        
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- Sprint 3: Real-Time Availability Check (NEW) ---
const checkAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        const MAX_CAPACITY = 10; // Set your daily limit here

        if (!date) return res.status(400).json({ message: "Please provide a date" });

        const currentBookings = await DaycareBooking.countDocuments({
            bookingDate: date,
            status: { $ne: 'Cancelled' }
        });

        const remainingSpots = MAX_CAPACITY - currentBookings;

        res.json({
            date: date,
            booked: currentBookings,
            capacity: MAX_CAPACITY,
            remainingSpots: remainingSpots > 0 ? remainingSpots : 0,
            isFull: currentBookings >= MAX_CAPACITY
        });

    } catch (error) {
        console.error("Availability Check Error:", error);
        res.status(500).json({ message: "Server Error checking availability" });
    }
};

module.exports = {
    getDaycarePackages,
    createDaycarePackage,
    createBooking,
    updateBookingStatus,
    getBookingStatus,
    checkAvailability // <--- Now exported safely
};