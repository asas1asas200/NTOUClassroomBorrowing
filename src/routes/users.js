var express = require("express");
const User = require("../models/user.js");

var router = express.Router();

var passport = require("passport");

const auth = require("../middleware/auth");

let makeField = (name, label, type) =>
  `
    <div class="mb-3 row">
      <label for="${name}" class="col-3 col-form-label text-nowrap"> ${label} </label>
      <div class="col">
        <input type="${type}" class="form-control" name="${name}" placeholder="${label}" required>
      </div>
    </div>
`;

router.get("/", function (req, res, next) {
  res.redirect("/home");
});

router.post("/register", async (req, res) => {
  try {
    // TODO: verify infos like if user exist, if email is valid, etc
    const user = new User({
      username: req.body.username,
      // TODO: hash password agiain
      password: req.body.password,
      email: req.body.email,
      admin: false,
      id: req.body.id,
      phone: req.body.phone,
      emailVerified: false,
      verified: false,
    });
    await user.save();
    res.redirect("/users/session");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/session", auth.unloginedUser, function (req, res, next) {
  res.render("user/entry", {
    title: "Session",
    makeField: makeField,
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/session",
  }),
  function (req, res) {
    res.redirect("/home");
  }
);

router.post("/logout", function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/users/session");
  });
});

/* ---- Test page can be removed in the future. --- */
router.get("/logined", auth.loginedUser, function (req, res) {
  res.send("logined user only page");
});

router.get("/admin_only", auth.admin, function (req, res) {
  res.send("admin only page");
});
/* ----------------------------------------------- */

module.exports = router;
