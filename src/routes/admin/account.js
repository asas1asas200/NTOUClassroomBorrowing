var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  let fakeData = [
    { id: "001", name: "user1", verified: false },
    { id: "002", name: "user2", verified: true },
    { id: "003", name: "user3", verified: false },
    { id: "004", name: "user4", verified: true },
  ];

  res.render("admin/home", { title: "Admin", page: "account", data: fakeData });
});

module.exports = router;
