const express = require("express");

const {
  createCategory,
  getCategories
} = require("../controllers/categoryController");
const {
  authenticate,
  authorize
} = require("../middleware/authenticate");

const router = express.Router();

router.get("/", getCategories);
router.post("/", authenticate, authorize("admin"), createCategory);

module.exports = router;
