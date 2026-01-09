const mongoose = require('mongoose');

const daycarePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a package name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration']
  },
  features: {
    type: [String],
    required: [true, 'Please add features']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DaycarePackage', daycarePackageSchema);