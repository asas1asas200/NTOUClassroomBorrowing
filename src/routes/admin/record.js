var express = require("express");
var router = express.Router();

const Record = require("../../models/record");

router.get("/", async function (req, res) {
  res.render("admin/home", {
    title: "Admin",
    page: "record",
    data: { records: await Record.findPendingRecords() },
  });
});

router.get("/:id", async function (req, res) {
  res.render("admin/recordInfo", {
    record: await Record.findById(req.params.id)
      .populate({
        path: "classroom",
        populate: {
          path: "floor",
          populate: {
            path: "building",
          },
        },
      })
      .populate("borrower")
      .lean(),
  });
});

router.put("/:id", async function (req, res) {
  let record = await Record.findById(req.params.id);
  record.status = req.body.data.status;
  if (req.body.data.status == "Reject") {
    record.rejectReason = req.body.data.rejectReason;
  }
  await record.save();
  res.status(200).send("OK");
});

module.exports = router;
