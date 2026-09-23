const User = require("../models/User");

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile
};