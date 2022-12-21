const mongoose = require("mongoose");
const Lesson = require("./lesson");

const Record = Lesson.discriminator(
  "Record",
  new mongoose.Schema({
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
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
      enum: ["Pending", "Approve", "Borrowing", "Finish", "Reject", "Cancel"],
      required: true,
    },
    rejectReason: {
      type: String,
      required: function () {
        return this.status == "Reject";
      },
    },
  })
);

module.exports = Record;
