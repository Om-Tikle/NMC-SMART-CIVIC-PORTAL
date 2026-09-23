const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required"
    });
  }

  try {
    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required"
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      department: user.department ? user.department.toString() : null
    };

    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission for this action"
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize
};
