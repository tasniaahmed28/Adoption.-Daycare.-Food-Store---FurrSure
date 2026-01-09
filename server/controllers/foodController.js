const Food = require("../models/Food");

// Existing function to get all foods
exports.getAllFoods = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    const foods = await Food.find(filter);
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching foods" });
  }
};

// New function to get food by ID
exports.getFoodById = async (req, res) => {
  const { id } = req.params;  // Extract the product ID from the route parameter

  try {
    const foodItem = await Food.findById(id);  // Find the food item by ID
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });  // If not found, return 404
    }

    res.status(200).json(foodItem);  // Return the food item details
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).json({ message: "Server error" });  // Handle server errors
  }
};


