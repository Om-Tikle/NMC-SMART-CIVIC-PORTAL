const express = require("express");

const {
  createDepartment,
  getDepartments
} = require("../controllers/departmentController");
const {
  authenticate,
  authorize
} = require("../middleware/authenticate");

const router = express.Router();

router.get("/", getDepartments);
router.post("/", authenticate, authorize("admin"), createDepartment);

module.exports = router;