const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema(
  {
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
  },
  {
    methods: {
      // NOTE: The floor object must populate when query.
      async deleteFloor() {
        this.building.floors.pull(this._id);
        this.building.save();
        this.classrooms.forEach((classroom) => classroom.remove());
        this.remove();
      },
    },
  }
);

// Side effect: Also change the building's floors array.
floorSchema.static("newFloor", async function (building, name) {
  let floor = new this({
    name: name,
    building: building,
  });
  await floor.save();
  building.floors.push(floor);
  await building.save();
  return floor;
});

module.exports = mongoose.model("Floor", floorSchema);
