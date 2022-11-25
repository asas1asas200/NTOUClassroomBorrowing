var express = require("express");
const Lesson = require("../../models/lesson");
var router = express.Router();

router.get("/", async function (req, res, next) {
  console.log(await Lesson.find({}));
  res.render("admin/home", {
    title: "Admin",
    page: "lesson",
    data: { lessons: await Lesson.find({}).lean() },
  });
});

router.post("/", async function (req, res, next) {
  try {
    const lesson = new Lesson({
      name: req.body.data.name,
      teacher: req.body.data.teacher,
      description: req.body.data.description,
      fixed: true,
    });
    await lesson.save();
    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/empty", async function (req, res, next) {
  res.render("admin/lessonInfo", { name: "", teacher: "", description: "" });
});

module.exports = router;
