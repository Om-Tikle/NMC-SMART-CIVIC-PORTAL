const Department = require("../models/Department");
const {
  createDepartmentSchema
} = require("../validators/departmentValidator");

const createDepartment = async (req, res, next) => {
  try {
    const validation = createDepartmentSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid department data",
        errors: validation.error.issues
      });
    }

    const { name, description, contactEmail } = validation.data;

    const existingDepartment = await Department.findOne({ name });

    if (existingDepartment) {
      return res.status(409).json({
        success: false,
        message: "A department with this name already exists"
      });
    }

    const department = await Department.create({
      name,
      description,
      contactEmail
    });

    return res.status(201).json({
      success: true,
      message: "Department created",
      data: {
        department
      }
    });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (_req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({
      name: 1
    });

    return res.status(200).json({
      success: true,
      data: {
        departments
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDepartment,
  getDepartments
};