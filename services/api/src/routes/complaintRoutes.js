const express = require("express");

const {
  createComplaint,
  getComplaints,
  getComplaintById
} = require("../controllers/complaintController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.use(authenticate);
router.post("/", createComplaint);
router.get("/", getComplaints);
router.get("/:id", getComplaintById);

module.exports = router;
