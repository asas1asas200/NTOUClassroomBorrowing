var express = require("express");
var curriculumRouter = require("./curriculum");
var router = express.Router();

router.use("/curriculum", curriculumRouter);

router.get("/", async function (req, res) {
  res.render("home/home");
});

module.exports = router;
