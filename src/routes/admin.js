var express = require("express");
var router = express.Router();

const Building = require("../models/building");
const Floor = require("../models/floor");
const Classroom = require("../models/classroom");

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

router.post("/classroom", async function (req, res, next) {
  /*
   req.body.data = {
    type: "add" or "delete",
    target: "building" or "floor" or "classroom",
    building: "電機二館",
  }
  */
  console.log("req.body: ", req.body);
  let data = req.body.data;
  try {
    switch (data.type) {
      case "add":
        switch (data.target) {
          case "building":
            const building = new Building({
              name: data.building,
            });
            await building.save();
            break;
        }
        break;
    }
    res.status(200).send("OK");
  } catch (e) {
    if (e.code === 11000) {
      res.status(409).send("409 Already exist");
    } else {
      res.status(400).send("400 Bad Request");
    }
  }
});

module.exports = router;
