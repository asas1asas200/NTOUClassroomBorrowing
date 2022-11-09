var express = require("express");
var router = express.Router();

const auth = require("../../middleware/auth");

var classroomRouter = require("./classroom");

router.use(auth.admin);
router.use("/classroom", classroomRouter);

router.get("/", function (req, res, next) {
  res.render("admin/home", { title: "Admin", page: null });
});

module.exports = router;
