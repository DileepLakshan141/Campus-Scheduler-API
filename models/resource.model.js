const mongoose = require("mongoose");

const resourceSchema = mongoose.Schema(
  {
    resource_id: {
      type: String,
      required: [true, "resource id is required!"],
    },

    resource_type: {
      type: String,
      required: [true, "resource type is required!"],
    },

    resource_name: {
      type: String,
      required: [true, "resource name is required!"],
    },

    availability: {
      type: Boolean,
      default: true,
    },

    bookedBy: {
      type: mongoose.Types.ObjectId,
      refPath: "bookedByModel",
    },

    bookedByModel: {
      type: String,
      enum: ["Faculty", "Admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
