const Complaint = require("../models/Complaint");
const ComplaintCategory = require("../models/ComplaintCategory");
const User = require("../models/User");
const {
  createComplaintSchema
} = require("../validators/complaintValidator");

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

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById
};
