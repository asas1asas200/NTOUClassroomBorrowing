const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schedule: {
      type: String, // JSON string
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },
    options: [
      {
        type: String,
      },
    ],
  },
  {
    methods: {
      async update(info) {
        this.name = info.name;
        this.schedule = JSON.stringify(info.schedule);
        this.capacity = info.capacity;
        this.options = info.options;
        await this.save();
      },
    },
  }
);

classroomSchema.static("newClassroom", async function (floor, info) {
  let classroom = new this({
    name: info.name,
    floor: floor,
    capacity: info.capacity,
    schedule: JSON.stringify(info.schedule),
    options: info.options,
  });
  await classroom.save();
  floor.classrooms.push(classroom);
  await floor.save();
  return classroom;
});

module.exports = mongoose.model("Classroom", classroomSchema);
