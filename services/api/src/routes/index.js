const express = require("express");

const authRoutes = require("./authRoutes");
const departmentRoutes = require("./departmentRoutes");
const categoryRoutes = require("./categoryRoutes");
const complaintRoutes = require("./complaintRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NMC Civic API is running"
  });
});

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/categories", categoryRoutes);
router.use("/complaints", complaintRoutes);
router.use("/users", userRoutes);

module.exports = router;
