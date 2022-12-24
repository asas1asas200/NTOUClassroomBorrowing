var express = require("express");
var router = express.Router();

const Record = require("../../models/record");
const Classroom = require("../../models/classroom");

router.get("/", async function (req, res) {
  let findStatus = async (status) =>
    Record.find({ status: status })
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

  const approve = findStatus("Approve");
  const borrowing = findStatus("Borrowing");

  Promise.all([approve, borrowing]).then((values) => {
    res.render("admin/home", {
      title: "Admin",
      page: "borrow",
      data: {
        Approve: values[0],
        Borrowing: values[1],
      },
    });
  });
});

router.put("/:id", async function (req, res) {
  try {
    let record = await Record.findById(req.params.id);
    let classroom = await Classroom.findById(record.classroom);
    if (req.body.data.status == "Borrowing" && record.status == "Approve") {
      if (classroom.keyState == "Free") {
        record.status = "Borrowing";
        classroom.keyState = "Borrowing";
      } else {
        throw new Error("The key has not been returned.");
      }
    } else if (
      req.body.data.status == "Finish" &&
      record.status == "Borrowing"
    ) {
      record.status = "Finish";
      classroom.keyState = "Free";
    } else {
      throw new Error("Invalid status change.");
    }
    await record.save();
    await classroom.save();
    res.status(200).send("OK");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
