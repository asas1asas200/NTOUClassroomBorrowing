var express = require("express");
var router = express.Router();
const Building = require("../../models/building");
const Classroom = require("../../models/classroom");
const Lesson = require("../../models/lesson");
const Record = require("../../models/record");

async function returnCurriculum(req, res, date) {
  try {
    const dateRecords = await Record.find({
      date: date,
      status: {
        $in: ["Approve", "Borrowing", "Finish"],
      },
    }).lean();
    var records = {};
    for (let record of dateRecords) {
      if (!records[record.classroom]) records[record.classroom] = {};
      for (let i = record.period; i < record.period + record.during; i++) {
        records[record.classroom][i] = record;
      }
    }

    res.render("home/curriculum", {
      user: req.user,
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
      records: records,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
}

router.get("/", async function (req, res) {
  returnCurriculum(req, res, new Date());
});

router.get("/:date", async function (req, res) {
  returnCurriculum(req, res, new Date(req.params.date));
});

router.get("/lesson/:id", async function (req, res) {
  res.render("home/lessonInfo", {
    lesson: await Lesson.findById(req.params.id).lean(),
  });
});

router.get("/classroom/:id", async function (req, res) {
  res.status(200).json(
    await Classroom.findById(req.params.id)
      .populate({
        path: "floor",
        populate: {
          path: "building",
          model: "Building",
        },
      })
      .lean()
  );
});

router.post("/record", async function (req, res) {
  try {
    const borrowInfo = req.body;
    let record = new Record({
      name: borrowInfo.name,
      teacher: borrowInfo.teacher,
      description: borrowInfo.description,
      borrower: req.user._id,
      classroom: borrowInfo.classroom,
      date: borrowInfo.date,
      period: borrowInfo.period,
      during: borrowInfo.during,
      status: "Pending",
    });
    await record.save();
    res.status(200).send("OK");
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
