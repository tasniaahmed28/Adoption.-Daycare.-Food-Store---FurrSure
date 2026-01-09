// server/routes/adoptionRoutes.js

const express = require("express");
const router = express.Router();
const AdoptionRequest = require("../models/AdoptionRequest");
const { protect, admin } = require("../middleware/auth");

// =======================================================
// FEATURE-10: Create adoption request (PUBLIC)
// POST /api/adoption-requests
// =======================================================
router.post("/", async (req, res) => {
  try {
    console.log("📥 Adoption request received:", req.body); // ✅ DEBUG LOG

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

    if (
      !petId ||
      !petName ||
      !fullName ||
      !email ||
      !phone ||
      !reason ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
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
      status: "pending",
      reviewedAt: null,
      reviewedBy: null,
    });

    return res.status(201).json({
      success: true,
      message: "Adoption request submitted successfully",
      data: request,
    });
  } catch (err) {
    console.error("❌ Error creating adoption request:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create adoption request.",
    });
  }
});

// =======================================================
// FEATURE-12 (USER): My adoption history
// GET /api/adoption-requests/my-history
// =======================================================
router.get("/my-history", protect, async (req, res) => {
  try {
    const myEmail = req.user.email;

    const history = await AdoptionRequest.find({
      email: myEmail,
      status: { $in: ["approved", "rejected"] },
    }).sort({ reviewedAt: -1 });

    return res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    console.error("❌ User history error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load adoption history",
    });
  }
});

// =======================================================
// FEATURE-12 (ADMIN): Full adoption history
// GET /api/adoption-requests/history
// =======================================================
router.get("/history", protect, admin, async (req, res) => {
  try {
    const history = await AdoptionRequest.find({
      status: { $in: ["approved", "rejected"] },
    })
      .populate("petId", "name category")
      .sort({ reviewedAt: -1 });

    return res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    console.error("❌ Admin history error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load adoption history",
    });
  }
});

// =======================================================
// FEATURE-11: Admin view ALL requests (ADMIN ONLY)
// GET /api/adoption-requests
// =======================================================
router.get("/", protect, admin, async (req, res) => {
  try {
    const requests = await AdoptionRequest.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    console.error("❌ Error fetching adoption requests:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch adoption requests.",
    });
  }
});

// =======================================================
// FEATURE-11: Admin approve / reject
// PATCH /api/adoption-requests/:id/status
// =======================================================
router.patch("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updated = await AdoptionRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedAt: new Date(),
        reviewedBy: req.user._id,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Adoption request not found",
      });
    }

    return res.json({
      success: true,
      message: "Request status updated",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Status update error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
});

module.exports = router;
