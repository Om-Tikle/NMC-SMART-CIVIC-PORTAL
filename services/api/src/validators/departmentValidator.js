const { z } = require("zod");

const createDepartmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  contactEmail: z.string().trim().email().optional()
});

module.exports = {
  createDepartmentSchema
};
