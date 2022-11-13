var express = require("express");
var router = express.Router();

const User = require("../../models/user");

router.get("/", async function (req, res, next) {
  let users = await User.find({ verified: false }).lean();

  res.render("admin/home", { title: "Admin", page: "account", data: users });
});

router.get("/:id", async function (req, res, next) {
  let user = await User.findOne({ id: req.params.id }).lean();

  res.render("admin/accountInfo", { user: user });
});

router.post("/:id", async function (req, res, next) {
  try {
    let user = await User.findOne({ id: req.params.id }).lean();
    user.verified = req.body.data.verified;
    await User.updateOne({ id: req.params.id }, user);

    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
