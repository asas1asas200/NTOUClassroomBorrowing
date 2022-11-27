var express = require("express");
var router = express.Router();
const Building = require("../models/building");

router.get("/", async function (req, res) {
  res.render("home", {
    buildings: await Building.find({})
      .populate({
        path: "floors",
        populate: {
          path: "classrooms",
          model: "Classroom",
          populate: [
            [
              {
                path: "schedule",
                model: "Lesson",
                options: { retainNullValues: true },
              },
            ],
          ],
        },
      })
      .lean(),
  });
});

module.exports = router;
