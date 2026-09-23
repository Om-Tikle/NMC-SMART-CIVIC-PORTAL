const express = require("express");

const {
  register,
  login
} = require("../controllers/authController");
const { getMyProfile } = require("../controllers/profileController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMyProfile);

module.exports = router;