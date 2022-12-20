const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

// Only find the lessons and dont return records
lessonSchema.static("findLessons", async function () {
  return await this.find({
    __t: {
      $ne: "Record",
    },
  }).lean();
});

lessonSchema.static("findPendingRecords", async function () {
  return await this.find({
    status: "Pending",
    __t: "Record",
  }).lean();
});

module.exports = mongoose.model("Lesson", lessonSchema);
