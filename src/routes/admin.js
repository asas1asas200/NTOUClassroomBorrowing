var express = require("express");
var router = express.Router();

const Building = require("../models/building");
const Floor = require("../models/floor");
const Classroom = require("../models/classroom");

const auth = require("../middleware/auth");

router.use(auth.admin);

function errorHandle(e, res) {
  if (e.code === 11000) {
    res.status(409).send("409 Already exist");
  } else {
    res.status(400).send("400 Bad Request");
  }
}

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

router.post("/building", async function (req, res, next) {
  /*
   req.body.data = {
    _cfrf: csrfToken,
    name: "電機二館",
  }
  */
  try {
    const building = new Building({
      name: req.body.data.name,
    });
    await building.save();
    res.status(200).send("OK");
  } catch (e) {
    errorHandle(e, res);
  }
});

router.delete("/building/:id", async function (req, res, next) {
  /*
    req.body.data = {
      _cfrf: csrfToken,
    }
    req.body.params = "電機二館"
    }
  */
  try {
    await Building.deleteOne({ name: req.params.id });
    res.status(200).send("OK");
  } catch (e) {
    errorHandle(e, res);
  }
});

module.exports = router;
