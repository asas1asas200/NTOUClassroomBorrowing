var express = require("express");
const User = require("../models/user.js");

var router = express.Router();

var csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });

var passport = require("passport");

const auth = require("../middleware/auth");

let makeField = (name, label, type) =>
  `
    <div class="mb-3 row">
      <label for="${name}" class="col-3 col-form-label"> ${label} </label>
      <div class="col">
        <input type="${type}" class="form-control" id="${name}" name="${name}" placeholder="${label}" required>
      </div>
    </div>
`;

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", csrfProtection, async (req, res) => {
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
      confirmed: false,
    });
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/new", csrfProtection, function (req, res, next) {
  res.render("user/entry", {
    title: "Register",
    form: "registerForm",
    csrfToken: req.csrfToken(),
    makeField: makeField,
  });
});

router.get("/login", csrfProtection, function (req, res) {
  res.render("user/entry", {
    title: "Login",
    form: "loginForm",
    csrfToken: req.csrfToken(),
    makeField: makeField,
  });
});

router.post(
  "/login",
  csrfProtection,
  passport.authenticate("local", {
    failureRedirect: "/users/login",
  }),
  function (req, res) {
    res.redirect("/");
  }
);

/* ---- Test page can be removed in the future. --- */
router.get("/logined", auth.loginedUser, function (req, res) {
  res.send("logined user only page");
});

router.get("/admin_only", auth.admin, function (req, res) {
  res.send("admin only page");
});
/* ----------------------------------------------- */

module.exports = router;
