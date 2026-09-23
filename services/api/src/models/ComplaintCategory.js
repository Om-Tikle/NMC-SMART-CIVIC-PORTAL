const mongoose = require("mongoose");

const complaintCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    defaultDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "ComplaintCategory",
  complaintCategorySchema
);