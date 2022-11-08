const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  floor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor",
  },
});

classroomSchema.static("newClassroom", async function (floor, name) {
  let classroom = new this({
    name: name,
    floor: floor,
  });
  await classroom.save();
  floor.classrooms.push(classroom);
  await floor.save();
  return classroom;
});

module.exports = mongoose.model("Classroom", classroomSchema);
