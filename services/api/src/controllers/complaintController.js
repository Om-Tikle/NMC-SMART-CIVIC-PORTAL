const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const ComplaintCategory = require("../models/ComplaintCategory");
const User = require("../models/User");
const ComplaintUpdate = require("../models/ComplaintUpdate");
const {
  createComplaintSchema,
  updateStatusSchema,
  assignComplaintSchema,
  resolutionSchema
} = require("../validators/complaintValidator");

const complaintStatuses = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
  "Reopened",
  "Rejected"
];

const complaintDetails = [
  { path: "category", select: "name description" },
  { path: "assignedDepartment", select: "name" },
  { path: "assignedFieldWorker", select: "name email phone" }
];

const createComplaint = async (req, res, next) => {
  try {
    const validation = createComplaintSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint data",
        errors: validation.error.issues
      });
    }

    const { category: categoryId, title, description, location, priority } =
      validation.data;
    const category = await ComplaintCategory.findOne({
      _id: categoryId,
      isActive: true
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Complaint category is not available"
      });
    }

    const complaint = await Complaint.create({
      citizen: req.user.id,
      category: category._id,
      title,
      description,
      location: {
        type: "Point",
        coordinates: location.coordinates
      },
      priority,
      status: "Submitted",
      assignedDepartment: category.defaultDepartment
    });

        await ComplaintUpdate.create({
      complaint: complaint._id,
      author: req.user.id,
      status: "Submitted",
      note: "Complaint submitted"
    });

    await complaint.populate(complaintDetails);

    return res.status(201).json({
      success: true,
      message: "Complaint submitted",
      data: { complaint }
    });
  } catch (error) {
    next(error);
  }
};

const getComplaints = async (req, res, next) => {
  try {
    let filter;

    if (req.user.role === "citizen") {
      filter = { citizen: req.user.id };
    } else if (req.user.role === "staff") {
      const staffMember = await User.findById(req.user.id).select("department");

      if (!staffMember.department) {
        return res.status(403).json({
          success: false,
          message: "Staff account is not assigned to a department"
        });
      }

      filter = { assignedDepartment: staffMember.department };
    } else if (req.user.role === "field_worker") {
      filter = { assignedFieldWorker: req.user.id };
    } else {
      filter = {};
    }
    
    const { status } = req.query;
    if (status) {
      if (!complaintStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter"
        });
      }

      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .populate(complaintDetails)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { complaints }
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      complaintDetails
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    const isCitizenOwner =
      req.user.role === "citizen" && complaint.citizen.toString() === req.user.id;
    const isDepartmentStaff =
      req.user.role === "staff" &&
      req.user.department &&
      complaint.assignedDepartment._id.toString() === req.user.department;
    const isAssignedFieldWorker =
      req.user.role === "field_worker" &&
      complaint.assignedFieldWorker &&
      complaint.assignedFieldWorker._id.toString() === req.user.id;

    if (
      req.user.role !== "admin" &&
      !isCitizenOwner &&
      !isDepartmentStaff &&
      !isAssignedFieldWorker
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this complaint"
      });
    }

    return res.status(200).json({
      success: true,
      data: { complaint }
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    next(error);
  }
};

const statusTransitions = {
  Submitted: ["Under Review", "Rejected"],
  "Under Review": ["Assigned", "Rejected"],
  Assigned: ["In Progress"],
  "In Progress": ["Resolved"],
  Reopened: ["Assigned"]
};

const fieldWorkerStatuses = ["In Progress", "Resolved"];

const updateComplaintStatus = async (req, res, next) => {
  try {
    const validation = updateStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid status data",
        errors: validation.error.issues
      });
    }

    const { status, note } = validation.data;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    const { role, id, department } = req.user;

    const isDepartmentStaff =
      role === "staff" &&
      department &&
      complaint.assignedDepartment.toString() === department;
    const isAssignedFieldWorker =
      role === "field_worker" &&
      complaint.assignedFieldWorker &&
      complaint.assignedFieldWorker.toString() === id;

    if (role !== "admin" && !isDepartmentStaff && !isAssignedFieldWorker) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this complaint"
      });
    }

    if (isAssignedFieldWorker && !fieldWorkerStatuses.includes(status)) {
      return res.status(403).json({
        success: false,
        message: "Field workers can only mark work In Progress or Resolved"
      });
    }

    const allowed = statusTransitions[complaint.status] || [];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${complaint.status} to ${status}`
      });
    }

    complaint.status = status;
    await complaint.save();

    await ComplaintUpdate.create({
      complaint: complaint._id,
      author: id,
      status,
      note
    });

    await complaint.populate(complaintDetails);

    return res.status(200).json({
      success: true,
      message: "Complaint status updated",
      data: { complaint }
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    next(error);
  }
};

const assignComplaint = async (req, res, next) => {
  try {
    const validation = assignComplaintSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment data",
        errors: validation.error.issues
      });
    }

    const { fieldWorkerId, note } = validation.data;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    const { role, id, department } = req.user;

    const isDepartmentStaff =
      role === "staff" &&
      department &&
      complaint.assignedDepartment.toString() === department;

    if (role !== "admin" && !isDepartmentStaff) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to assign this complaint"
      });
    }

    if (!["Under Review", "Reopened"].includes(complaint.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot assign a complaint that is ${complaint.status}`
      });
    }

    const fieldWorker = await User.findOne({
      _id: fieldWorkerId,
      role: "field_worker",
      isActive: true
    });

    if (!fieldWorker) {
      return res.status(400).json({
        success: false,
        message: "Field worker not found"
      });
    }

    complaint.assignedFieldWorker = fieldWorker._id;
    complaint.status = "Assigned";
    await complaint.save();

    await ComplaintUpdate.create({
      complaint: complaint._id,
      author: id,
      status: "Assigned",
      note: note || `Assigned to ${fieldWorker.name}`
    });

    await complaint.populate(complaintDetails);

    return res.status(200).json({
      success: true,
      message: "Complaint assigned",
      data: { complaint }
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    next(error);
  }
};

const getComplaintUpdates = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    const { role, id, department } = req.user;

    const isCitizenOwner =
      role === "citizen" && complaint.citizen.toString() === id;
    const isDepartmentStaff =
      role === "staff" &&
      department &&
      complaint.assignedDepartment.toString() === department;
    const isAssignedFieldWorker =
      role === "field_worker" &&
      complaint.assignedFieldWorker &&
      complaint.assignedFieldWorker.toString() === id;

    if (
      role !== "admin" &&
      !isCitizenOwner &&
      !isDepartmentStaff &&
      !isAssignedFieldWorker
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this complaint"
      });
    }

    const updates = await ComplaintUpdate.find({ complaint: complaint._id })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: { updates }
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    next(error);
  }
};

const respondToResolution = async (req, res, next) => {
  try {
    const validation = resolutionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid resolution response",
        errors: validation.error.issues
      });
    }

    const { action, note } = validation.data;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    const isCitizenOwner =
      req.user.role === "citizen" &&
      complaint.citizen.toString() === req.user.id;

    if (!isCitizenOwner) {
      return res.status(403).json({
        success: false,
        message: "Only the citizen who filed this complaint can respond"
      });
    }

    if (complaint.status !== "Resolved") {
      return res.status(400).json({
        success: false,
        message: `Only a Resolved complaint can be confirmed or reopened. This one is ${complaint.status}`
      });
    }

    const newStatus = action === "confirm" ? "Closed" : "Reopened";

    complaint.status = newStatus;
    await complaint.save();

    await ComplaintUpdate.create({
      complaint: complaint._id,
      author: req.user.id,
      status: newStatus,
      note:
        note ||
        (action === "confirm"
          ? "Citizen confirmed the resolution"
          : "Citizen reopened the complaint")
    });

    await complaint.populate(complaintDetails);

    return res.status(200).json({
      success: true,
      message:
        action === "confirm" ? "Complaint closed" : "Complaint reopened",
      data: { complaint }
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    next(error);
  }
};

const getComplaintSummary = async (req, res, next) => {
  try {
    const { role, department } = req.user;

    if (!["staff", "admin"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view the summary"
      });
    }

    const match = {};

    if (role === "staff") {
      if (!department) {
        return res.status(403).json({
          success: false,
          message: "Staff account is not assigned to a department"
        });
      }

      match.assignedDepartment = new mongoose.Types.ObjectId(department);
    }

    const rows = await Complaint.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const byStatus = {};
    complaintStatuses.forEach((status) => {
      byStatus[status] = 0;
    });

    let total = 0;
    rows.forEach((row) => {
      byStatus[row._id] = row.count;
      total += row.count;
    });

    return res.status(200).json({
      success: true,
      data: { total, byStatus }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getComplaintUpdates,
  respondToResolution,
  getComplaintSummary
};