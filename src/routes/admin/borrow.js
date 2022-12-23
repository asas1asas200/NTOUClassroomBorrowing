var express = require("express");
var router = express.Router();

const Record = require("../../models/record");

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
    if (req.body.data.status == "Borrowing" && record.status == "Approve") {
      record.status = "Borrowing";
    } else if (
      req.body.data.status == "Finish" &&
      record.status == "Borrowing"
    ) {
      record.status = "Finish";
    } else {
      throw new Error("Invalid status change.");
    }
    await record.save();
    res.status(200).send("OK");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
