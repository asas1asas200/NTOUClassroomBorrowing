var express = require("express");
const User = require("../models/user.js");
const Record = require("../models/record.js");

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
      // hash password
      password: req.body.password,
      email: req.body.email,
      admin: false,
      id: req.body.id,
      phone: req.body.phone,
      emailVerified: false,
      verified: false,
    });

    await user.save(function (err) {
      if (err) throw err;
    });
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

//這邊出問題
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

router.get("/applications", auth.loginedUser, function (req, res) {
  let findRecordStatus = async (status) =>
    Record.find({
      borrower: req.user._id,
      status: status,
    })
      .populate({
        path: "classroom",
        populate: {
          path: "floor",
          model: "Floor",
          populate: {
            path: "building",
            model: "Building",
          },
        },
      })
      .lean();

  const pending = findRecordStatus("Pending");
  const approve = findRecordStatus("Approve");
  const reject = findRecordStatus("Reject");
  const borrowing = findRecordStatus("Borrowing");
  const finish = findRecordStatus("Finish");

  Promise.all([pending, approve, reject, borrowing, finish]).then((values) => {
    res.render("user/applications", {
      data: {
        Pending: values[0],
        Approve: values[1],
        Reject: values[2],
        Borrowing: values[3],
        Finish: values[4],
      },
    });
  });
});

/* ---- Test page can be removed in the future. --- */
router.get("/logined", auth.loginedUser, function (req, res) {
  res.send("logined user only page");
});

router.get("/admin_only", auth.admin, function (req, res) {
  res.send("admin only page");
});
