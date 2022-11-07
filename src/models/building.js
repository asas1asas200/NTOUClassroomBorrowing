const mongoose = require("mongoose");

const BuildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  floors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
    },
  ],
});

module.exports = mongoose.model("Building", BuildingSchema);
