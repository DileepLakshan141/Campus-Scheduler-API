const mongoose = require("mongoose");

const enrollmentSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },

    facultyId: {
      type: mongoose.Types.ObjectId,
      ref: "Faculty",
    },

    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
