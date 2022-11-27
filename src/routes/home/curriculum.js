var express = require("express");
var router = express.Router();
const Building = require("../../models/building");

async function returnCurriculum(req, res, date) {
  try {
    res.render("home/curriculum", {
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
      date: date,
    });
  } catch (e) {
    res.status(500).send(e);
  }
}

router.get("/", async function (req, res) {
  returnCurriculum(req, res, new Date());
});

router.get("/:date", async function (req, res) {
  returnCurriculum(req, res, new Date(req.params.date));
});

module.exports = router;
