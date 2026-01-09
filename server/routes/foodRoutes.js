const express = require("express");
const router = express.Router();
const { getAllFoods, getFoodById } = require("../controllers/foodController");  // Import the new function

// Get all foods
router.get("/", getAllFoods);

// Get a single food by ID
router.get("/:id", getFoodById);  // New route to fetch a single food item by ID

module.exports = router;

