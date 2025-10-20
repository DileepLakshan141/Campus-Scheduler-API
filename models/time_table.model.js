const mongoose = require("mongoose");

const timeTableSchema = mongoose.Schema(
  {
    academic_year: {
      type: String,
      required: [true, "academic year is required"],
    },

    faculty: {
      type: mongoose.Types.ObjectId,
      ref: "Faculty",
      required: [true, "faculty is required"],
    },

    monday_sessions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Session",
      },
    ],

    tuesday_sessions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Session",
      },
    ],

    wednesday_sessions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Session",
      },
    ],

    thursday_sessions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Session",
      },
    ],

    friday_sessions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Session",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeTable", timeTableSchema);
