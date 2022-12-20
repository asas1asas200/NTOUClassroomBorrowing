const mongoose = require("mongoose");
const Lesson = require("./lesson");

const Record = Lesson.discriminator(
  "Record",
  new mongoose.Schema({
    borrowerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    period: {
      type: Number,
      required: true,
    },
    during: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approve", "Finish", "Reject", "Cancel"],
      required: true,
    },
  })
);

module.exports = Record;
