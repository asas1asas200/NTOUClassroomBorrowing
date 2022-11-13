var express = require("express");
var router = express.Router();

const auth = require("../../middleware/auth");

router.use(auth.loginedUser);

router.get("/", function (req, res, next) {
  res.render("profile/home", { title: "profile edit", page: null });
});

module.exports = router;
