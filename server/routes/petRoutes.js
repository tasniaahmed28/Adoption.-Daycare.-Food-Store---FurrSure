// server/routes/petRoutes.js

const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const { getPets, getPetById } = require('../controllers/petsController');

// GET /api/pets - Get all pets with optional search/filter
router.get('/', getPets);

// GET /api/pets/:id - Get single pet by ID
router.get('/:id', getPetById);

module.exports = router;
// =========================
// GET ALL PETS (Feature 8)
// + SEARCH
// + CATEGORY FILTER
// =========================
router.get("/", async (req, res) => {
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

    const pets = await Pet.find(query);
    res.json(pets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// =========================
// GET SINGLE PET BY ID  
// (Feature 9)
// =========================
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
