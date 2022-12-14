const mongoose = require("mongoose");
const Record = require("./record");

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schedule: [
      [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
      ],
    ],
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
    keyState: {
      type: "String",
      enum: ["Free", "Borrowing"],
      required: true,
    },
  },
  {
    methods: {
      async update(info) {
        this.name = info.name;
        this.schedule = info.schedule;
        this.capacity = info.capacity;
        this.options = info.options;
        await this.save();
      },
      // NOTE: The classroom object must populate when query.
      async deleteClassroom() {
        this.floor.classrooms.pull(this._id);
        this.floor.save();
        this.remove();
      },
    },
  }
);

classroomSchema.pre("remove", function (next) {
  Record.deleteMany({ classroom: this._id }).exec();
  next();
});

classroomSchema.static("newClassroom", async function (floor, info) {
  let classroom = new this({
    name: info.name,
    floor: floor,
    capacity: info.capacity,
    schedule: info.schedule,
    options: info.options,
    keyState: "Free",
  });
  await classroom.save();
  floor.classrooms.push(classroom);
  await floor.save();
  return classroom;
});

module.exports = mongoose.model("Classroom", classroomSchema);
