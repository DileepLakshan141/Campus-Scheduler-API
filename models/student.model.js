const mongoose = require("mongoose");
const user_roles = require("../config/userRoles");
const { Student } = user_roles;

const studentSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "valid email address is required!"],
    },

    studentId: {
      type: String,
      required: [true, "valid student id is required!"],
    },

    nic: {
      type: String,
      required: [true, "valid nic is required!"],
    },

    faculty: {
      type: mongoose.Types.ObjectId,
      ref: "Faculty",
      required: [true, "faculty is required!"],
    },

    username: {
      type: String,
      required: [true, "valid username is required!"],
    },

    password: {
      type: String,
      required: [true, "valid password is required!"],
    },

    user_roles: {
      Student: {
        type: Number,
        default: Student,
      },
    },

    refresh_token: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
