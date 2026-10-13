const express = require("express");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  getComplaintUpdates,
  respondToResolution,
  getComplaintSummary
} = require("../controllers/complaintController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.use(authenticate);
router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/summary", getComplaintSummary);
router.get("/:id", getComplaintById);
router.get("/:id/updates", getComplaintUpdates);
router.patch("/:id/status", updateComplaintStatus);
router.post("/:id/assign", assignComplaint);
router.post("/:id/resolution", respondToResolution);

module.exports = router;
