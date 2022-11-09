var express = require("express");
var router = express.Router();

const Building = require("../models/building");
const Floor = require("../models/floor");
const Classroom = require("../models/classroom");

const auth = require("../middleware/auth");

router.use(auth.admin);

function errorHandle(e, res) {
  console.log(e);
  if (e.code === 11000) {
    res.status(409).send("409 Already exist");
  } else {
    res.status(400).send("400 Bad Request");
  }
}

router.get("/", function (req, res, next) {
  res.render("admin/home", { title: "Admin", page: null });
});

router.get("/classroom", async function (req, res, next) {
  // TODO: Rewrite this by JSON.stringify.
  //       This may change the format.
  let data = await Building.dumpJSON();

  res.render("admin/home", {
    title: "Admin",
    page: "classroom",
    data: data,
  });
});

router.post("/building", async function (req, res, next) {
  /*
   req.body._csrf =  csrfToken,
   req.body.data = {
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
      _csrf: csrfToken,
    }
    req.body.params = "電機二館"
    }
  */
  try {
    let building = await Building.findOne({ name: req.params.id }).populate({
      path: "floors",
      populate: {
        path: "classrooms",
        model: "Classroom",
      },
    });
    building.deleteBuilding();
    res.status(200).send("OK");
  } catch (e) {
    errorHandle(e, res);
  }
});

router.post("/floor", async function (req, res, next) {
  /*
    req._csrf: csrfToken,
    req.body.data = {
      building: "電機二館",
      name: "一樓",
    }
  */
  try {
    let building = await Building.findOne({
      name: req.body.data.building,
    });
    Floor.newFloor(building, req.body.data.name);

    res.status(200).send("OK");
  } catch (e) {
    errorHandle(e, res);
  }
});

router.delete("/building/:id/floor/:fid", async function (req, res, next) {
  /*
    req.body.data = {
      _csrf: csrfToken,
    }
    req.body.params = "樓層"
  */
  try {
    let building = await Building.findOne({ name: req.params.id });
    let floor = await Floor.findOne({
      name: req.params.fid,
      building: building,
    }).populate("building");
    floor.deleteFloor();

    res.status(200).send("OK");
  } catch (e) {
    errorHandle(e, res);
  }
});

// Empty classroom form
router.get("/classroom/empty", async function (req, res, next) {
  res.render("admin/classroomInfo", {
    name: "",
    capacity: 0,
    schedule: null,
    options: [],
  });
});

// Classroom info
router.get(
  "/building/:id/floor/:fid/classroom/:cid",
  async function (req, res, next) {
    try {
      let building = await Building.findOne({ name: req.params.id });
      let floor = await Floor.findOne({
        name: req.params.fid,
        building: building,
      });
      let classroom = await Classroom.findOne({
        name: req.params.cid,
        floor: floor,
      });
      res.render("admin/classroomInfo", {
        name: classroom.name,
        capacity: classroom.capacity,
        schedule: JSON.parse(classroom.schedule),
        options: classroom.options,
      });
    } catch (e) {
      errorHandle(e, res);
    }
  }
);

// Create new classroom
router.post("/classroom", async function (req, res, next) {
  /*
    req._csrf: csrfToken,
    req.body.data = {
      building: "電機二館",
      floor: "一樓",
      name: "103",
      capacity: 30,
      schedule: {JSON},
      options: ["computer"],
    }
  */

  // TODO: add more information about classroom
  try {
    let building = await Building.findOne({ name: req.body.data.building });
    let floor = await Floor.findOne({
      name: req.body.data.floor,
      building: building,
    });
    Classroom.newClassroom(floor, req.body.data);

    res.status(200).send("OK");
  } catch (e) {
    errorHandle(e, res);
  }
});

router.put(
  "/building/:id/floor/:fid/classroom/:cid",
  async function (req, res, next) {
    try {
      let building = await Building.findOne({ name: req.params.id });
      let floor = await Floor.findOne({
        name: req.params.fid,
        building: building,
      });
      let classroom = await Classroom.findOne({
        name: req.params.cid,
        floor: floor,
      });
      classroom.update(req.body.data);

      res.status(200).send("OK");
    } catch (e) {
      errorHandle(e, res);
    }
  }
);

module.exports = router;
