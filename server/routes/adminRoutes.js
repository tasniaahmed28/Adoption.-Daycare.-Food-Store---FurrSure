const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const AdoptionRequest = require('../models/AdoptionRequest'); // ✅ Add this
const { protect } = require('../middleware/auth');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, async (req, res) => {
  try {
    // Check admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegistrations = await User.countDocuments({
      createdAt: { $gte: today }
    });

    // Pet statistics
    const totalPets = await Pet.countDocuments();
    
    // Count pets by category
    const petsByCategory = await Pet.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    
    // Convert to object for easier access
    const categoryStats = {};
    petsByCategory.forEach(item => {
      categoryStats[item._id] = item.count;
    });

    // Adoption request statistics
    const totalAdoptionRequests = await AdoptionRequest.countDocuments();
    const pendingAdoptionRequests = await AdoptionRequest.countDocuments({
      // If you add status field: status: 'pending'
      // For now, we'll count all as pending if no status field
    });
    
    // Recent adoption requests (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentAdoptionRequests = await AdoptionRequest.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    res.json({
      success: true,
      data: {
        // User stats
        totalUsers,
        todayRegistrations,
        
        // Pet stats
        totalPets,
        availablePets: categoryStats.Dog || 0, // Example: show dogs as "available"
        pendingAdoptions: pendingAdoptionRequests,
        
        // Category breakdown
        petsByCategory: categoryStats,
        
        // Adoption stats
        totalAdoptionRequests,
        recentAdoptionRequests,
        
        // Today's registrations (already included)
        todayRegistrations
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get recent users
// @route   GET /api/admin/users/recent
// @access  Private/Admin
router.get('/users/recent', protect, async (req, res) => {
  try {
    // Check admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ✅ NEW: Get recent adoption requests
// @desc    Get recent adoption requests
// @route   GET /api/admin/adoption-requests/recent
// @access  Private/Admin
router.get('/adoption-requests/recent', protect, async (req, res) => {
  try {
    // Check admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const requests = await AdoptionRequest.find()
      .populate('petId', 'name category') // Get pet name and category
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// ✅ NEW: Get pets needing attention
// @desc    Get pets with pending adoption requests
// @route   GET /api/admin/pets/pending
// @access  Private/Admin
router.get('/pets/pending', protect, async (req, res) => {
  try {
    // Check admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // If you add adoptionStatus to Pet model:
    // const pendingPets = await Pet.find({ adoptionStatus: 'pending' })
    //   .limit(10);
    
    // For now, get recent pets
    const recentPets = await Pet.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: recentPets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;