const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ["dog", "cat", "bird", "fish", "other"]
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    imageUrl: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);


