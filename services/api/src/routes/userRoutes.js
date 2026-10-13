const express = require("express");

const { createUser } = require("../controllers/userController");
const {
  authenticate,
  authorize
} = require("../middleware/authenticate");

const router = express.Router();

router.use(authenticate, authorize("admin"));
router.post("/", createUser);

module.exports = router;