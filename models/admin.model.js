const mongoose = require("mongoose");
const user_roles = require("../config/userRoles");

const { Student, Faculty, Admin } = user_roles;

const adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "valid email address is required!"],
    },

    admin_id: {
      type: String,
      required: [true, "valid admin id is required!"],
    },

    username: {
      type: String,
      required: [true, "valid usernameis required!"],
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
      Faculty: {
        type: Number,
        default: Faculty,
      },
      Admin: {
        type: Number,
        default: Admin,
      },
    },

    refresh_token: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
