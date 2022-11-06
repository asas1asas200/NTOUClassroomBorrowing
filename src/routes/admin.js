var express = require("express");
const User = require("../models/user.js");

var router = express.Router();

const auth = require("../middleware/auth");

router.use(auth.admin);

router.get("/", function (req, res, next) {
  res.render("admin/home", { title: "Admin", page: null });
});

router.get("/classroom", function (req, res, next) {
  //TODO: communicate with database
  let fakeData = {
    buildings: {
      電機二館: {
        一樓: ["101", "105"],
        二樓: ["201", "203"],
        三樓: ["301", "303"],
      },
      電綜大樓: {
        一樓: ["101", "105"],
      },
    },
  };
  res.render("admin/home", {
    title: "Admin",
    page: "classroom",
    data: fakeData,
  });
});

module.exports = router;
