var express = require("express");
const User = require("../models/user.js");

var router = express.Router();

const auth = require("../middleware/auth");

router.use(auth.admin);

router.get("/", function (req, res, next) {
  res.render("admin/home", { title: "Admin" });
});

module.exports = router;
