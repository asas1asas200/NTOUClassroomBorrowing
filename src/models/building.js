const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema(
  {
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
  },
  {
    methods: {
      // NOTE: The building object must populate when query.
      async deleteBuilding() {
        this.floors.forEach(function (floor) {
          floor.classrooms.forEach((classroom) => classroom.remove());
          floor.remove();
        });
        this.remove();
      },
    },
  }
);

buildingSchema.static("dumpJSON", async function () {
  let buildings = await this.find({})
    .populate({
      path: "floors",
      populate: {
        path: "classrooms",
        model: "Classroom",
      },
    })
    .lean();

  let data = { buildings: {} };

  buildings.forEach((building) => {
    data.buildings[building.name] = {};
    building.floors.forEach((floor) => {
      data.buildings[building.name][floor.name] = floor.classrooms.map(
        (floor) => floor.name
      );
    });
  });
  return data;
});

module.exports = mongoose.model("Building", buildingSchema);
