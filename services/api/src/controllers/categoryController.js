const ComplaintCategory = require("../models/ComplaintCategory");
const Department = require("../models/Department");
const {
  createCategorySchema
} = require("../validators/categoryValidator");

const createCategory = async (req, res, next) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid category data",
        errors: validation.error.issues
      });
    }

    const { name, description, defaultDepartment } = validation.data;
    const department = await Department.findById(defaultDepartment);

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Default department does not exist"
      });
    }

    const existingCategory = await ComplaintCategory.findOne({ name });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this name already exists"
      });
    }

    const category = await ComplaintCategory.create({
      name,
      description,
      defaultDepartment
    });

    return res.status(201).json({
      success: true,
      message: "Complaint category created",
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (_req, res, next) => {
  try {
    const categories = await ComplaintCategory.find({ isActive: true })
      .populate("defaultDepartment", "name")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories
};
