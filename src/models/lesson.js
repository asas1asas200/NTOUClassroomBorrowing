const mongoose = require("mongoose");
const Classroom = require("./classroom");

const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  borrowerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  fixed: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model("Lesson", lessonSchema);
