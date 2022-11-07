const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor",
  },
});

module.exports = mongoose.model("Classroom", ClassroomSchema);
