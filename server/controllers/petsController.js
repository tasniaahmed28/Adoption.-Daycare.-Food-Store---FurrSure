const Pet = require('../models/Pet');

// @desc    Get all pets with search/filter
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = {};

    // Text search on name or breed
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } }
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    const pets = await Pet.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pets.length,
      message: 'Pets retrieved successfully',
      data: pets
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pets'
    });
  }
};

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    res.json({
      success: true,
      message: 'Pet retrieved successfully',
      data: pet
    });
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pet'
    });
  }
};

module.exports = {
  getPets,
  getPetById
};