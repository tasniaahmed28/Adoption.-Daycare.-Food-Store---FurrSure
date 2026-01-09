// server/controllers/adoptionController.js

const AdoptionRequest = require("../models/AdoptionRequest");

// @desc    Create a new adoption request
// @route   POST /api/adoption-requests
// @access  Public
const createAdoptionRequest = async (req, res) => {
  try {
    const {
      petId,
      petName,
      fullName,
      email,
      phone,
      reason,
      experience,
      preferredDate,
    } = req.body;

    // Validation
    if (!petId || !petName || !fullName || !email || !phone || !reason || !experience) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields."
      });
    }

    const request = await AdoptionRequest.create({
      petId,
      petName,
      fullName,
      email,
      phone,
      reason,
      experience,
      preferredDate,

      // ✅ Feature-11 safe defaults (won't break existing data)
      status: "pending",
      reviewedAt: null,
      reviewedBy: null,
    });

    res.status(201).json({
      success: true,
      message: "Adoption request submitted successfully",
      data: request
    });
  } catch (err) {
    console.error("Error creating adoption request:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create adoption request."
    });
  }
};

// @desc    Get all adoption requests
// @route   GET /api/adoption-requests
// @access  Private/Admin
const getAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      message: "Adoption requests retrieved successfully",
      data: requests
    });
  } catch (err) {
    console.error("Error fetching adoption requests:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch adoption requests."
    });
  }
};

// ✅ Feature-11 NEW: Admin approve/reject
// @desc    Update adoption request status (approve/reject)
// @route   PATCH /api/adoption-requests/:id/status
// @access  Private/Admin
const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use approved/rejected/pending."
      });
    }

    const updated = await AdoptionRequest.findByIdAndUpdate(
      id,
      {
        status,
        reviewedAt: new Date(),
        reviewedBy: req.user?._id || null, // ✅ if protect/admin middleware sets req.user
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Adoption request not found."
      });
    }

    res.json({
      success: true,
      message: "Adoption request status updated successfully",
      data: updated
    });
  } catch (err) {
    console.error("Error updating adoption request status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update adoption request status."
    });
  }
};

module.exports = {
  createAdoptionRequest,
  getAdoptionRequests,
  updateAdoptionRequestStatus, // ✅ Feature-11 export added safely
};
