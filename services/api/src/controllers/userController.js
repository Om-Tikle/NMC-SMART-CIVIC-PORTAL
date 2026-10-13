const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Department = require("../models/Department");
const { createUserSchema } = require("../validators/authValidator");

const createUser = async (req, res, next) => {
  try {
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
        errors: validation.error.issues
      });
    }

    const { name, email, phone, password, role, department } =
      validation.data;

    if (department) {
      const departmentExists = await Department.findOne({
        _id: department,
        isActive: true
      });

      if (!departmentExists) {
        return res.status(400).json({
          success: false,
          message: "Department does not exist"
        });
      }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      phone,
      password: passwordHash,
      role,
      department: role === "admin" ? null : department
    });

    return res.status(201).json({
      success: true,
      message: "User created",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser
};