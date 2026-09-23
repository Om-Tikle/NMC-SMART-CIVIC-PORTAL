const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  defaultDepartment: z.string().regex(/^[0-9a-fA-F]{24}$/)
});

module.exports = {
  createCategorySchema
};