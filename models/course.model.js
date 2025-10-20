const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "course name is required."],
      unique: true,
    },

    code: {
      type: String,
      required: [true, "course code is required."],
    },

    description: {
      type: String,
      required: [true, "course description is required."],
    },

    credits: {
      type: Number,
      required: [true, "course credits is required."],
    },

    offered_faculties: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Faculty",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
