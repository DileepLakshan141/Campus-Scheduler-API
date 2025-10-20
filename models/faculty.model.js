const mongoose = require("mongoose");
const user_roles = require("../config/userRoles");
const { Student, Faculty } = user_roles;

const facultySchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "valid email address is required!"],
    },

    username: {
      type: String,
      required: [true, "valid username is required!"],
    },

    password: {
      type: String,
      required: [true, "valid password is required!"],
    },

    faculty_id: {
      type: String,
      required: [true, "faculty must have an unique id"],
    },

    user_roles: {
      Student: {
        type: Number,
        default: Student,
      },
      Faculty: {
        type: Number,
        default: Faculty,
      },
    },

    refresh_token: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
