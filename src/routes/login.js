var express = require("express");
var router = express.Router();

login = "Welcome, user";

router.get("/", function (req, res) {
  res.render("login", { login });
});

module.exports = router;
