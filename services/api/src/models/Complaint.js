const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ComplaintCategory",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (coordinates) =>
            coordinates.length === 2 &&
            coordinates[0] >= -180 && coordinates[0] <= 180 &&
            coordinates[1] >= -90 && coordinates[1] <= 90,
          message: "Location coordinates must be [longitude, latitude]"
        }
      }
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
      default: "Submitted"
    },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal"
    },
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true
    },
    assignedFieldWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

complaintSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Complaint", complaintSchema);
