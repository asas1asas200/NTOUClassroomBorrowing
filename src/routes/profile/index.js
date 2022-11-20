var express = require("express");
var router = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/user");

router.use(auth.loginedUser);

router.get("/", async function (req, res, next) {
  let currentUser = req.user;
  res.render("profile/home", { title: "profile edit", data: currentUser });
});

router.post("/:id", async function (req, res, next) {
  try {
    let user = await User.findOne({ id: req.params.id }).lean();
    user.username = req.body.data.username;
    user.email = req.body.data.email;
    user.phone = req.body.data.phone;
    await User.updateOne({ id: req.params.id }, user);

    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
