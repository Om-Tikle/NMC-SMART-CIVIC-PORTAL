const mongoose = require("mongoose");

const complaintUpdateSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed",
        "Reopened",
        "Rejected"
      ],
      required: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ComplaintUpdate", complaintUpdateSchema);