var express = require("express");
var router = express.Router();

const auth = require("../../middleware/auth");

var classroomRouter = require("./classroom");
var accountRouter = require("./account");
var lessonRouter = require("./lesson");
var applicationsRouter = require("./applications");
var borrowRouter = require("./borrow");

router.use(auth.admin);
router.use("/classroom", classroomRouter);
router.use("/account", accountRouter);
router.use("/lesson", lessonRouter);
router.use("/applications", applicationsRouter);
router.use("/borrow", borrowRouter);

router.get("/", function (req, res, next) {
  res.render("admin/home", { title: "Admin", page: null });
});

module.exports = router;
