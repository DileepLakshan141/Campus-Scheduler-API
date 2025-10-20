const mongoose = require("mongoose");

const classSessionSchema = mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
    },

    session_category: {
      type: String,
      required: true,
    },

    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },

    faculty: {
      type: mongoose.Types.ObjectId,
      ref: "Faculty",
    },

    start_time: {
      type: String,
      required: [true, "start time is required!"],
    },

    end_time: {
      type: String,
      required: [true, "end time is required!"],
    },

    location: {
      type: mongoose.Types.ObjectId,
      ref: "Resource",
      required: [true, "location is required!"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", classSessionSchema);
