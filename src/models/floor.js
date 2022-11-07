const mongoose = require("mongoose");

const FloorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
    required: true,
  },
  classrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
  ],
});

module.exports = mongoose.model("Floor", FloorSchema);
