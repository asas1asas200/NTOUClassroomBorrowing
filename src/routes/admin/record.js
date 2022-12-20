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

module.exports = router;
