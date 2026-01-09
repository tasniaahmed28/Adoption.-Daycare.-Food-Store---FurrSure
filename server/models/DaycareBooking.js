const mongoose = require('mongoose');

const DaycareBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petName: { type: String, required: true },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'DaycarePackage', required: true },
    bookingDate: { type: String, required: true },
    status: { 
        type: String, 
        default: 'Confirmed',
        enum: ['Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'] 
    },
    // ✅ MAKE SURE THESE TWO LINES EXIST:
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('DaycareBooking', DaycareBookingSchema);