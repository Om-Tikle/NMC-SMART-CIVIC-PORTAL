const express = require("express");

const authRoutes = require("./authRoutes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NMC Civic API is running"
  });
});

router.use("/auth", authRoutes);

module.exports = router;