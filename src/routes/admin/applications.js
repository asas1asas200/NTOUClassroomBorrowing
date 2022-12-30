var express = require("express");
var router = express.Router();

const Record = require("../../models/record");

router.get("/", async function (req, res) {
  res.render("admin/home", {
    title: "Admin",
    page: "applications",
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
  } else {
    const periods = new Set([]);
    for (let i = record.period; i < record.period + record.during; i++) {
      periods.add(i);
    }
    const sameDateRecords = await Record.find({
      classroom: record.classroom,
      status: "Pending",
      date: record.date,
      _id: { $ne: record._id },
    });

    for (let r of sameDateRecords) {
      try {
        for (let i = r.period; i < r.period + r.during; i++) {
          if (periods.has(i)) {
            throw new Error("衝堂不可借用");
          }
        }
      } catch (e) {
        r.status = "Reject";
        r.rejectReason = e.message;
        await r.save();
      }
    }
  }
  await record.save();
  res.status(200).send("OK");
});

module.exports = router;
