var express = require("express");
const Lesson = require("../../models/lesson");
var router = express.Router();

router.get("/", async function (req, res, next) {
  res.render("admin/home", {
    title: "Admin",
    page: "lesson",
    data: { lessons: await Lesson.find({ fixed: true }).lean() },
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

router.get("/:id", async function (req, res, next) {
  try {
    let lesson = await Lesson.findById(req.params.id).lean();
    res.render("admin/lessonInfo", {
      name: lesson.name,
      teacher: lesson.teacher,
      description: lesson.description,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.put("/:id", async function (req, res, next) {
  let lesson = await Lesson.findById(req.params.id);
  lesson.name = req.body.data.name;
  lesson.teacher = req.body.data.teacher;
  lesson.description = req.body.data.description;
  await lesson.save();
  res.status(200).send("OK");
});

router.delete("/:id", async function (req, res, next) {
  Lesson.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).send("OK");
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

module.exports = router;
