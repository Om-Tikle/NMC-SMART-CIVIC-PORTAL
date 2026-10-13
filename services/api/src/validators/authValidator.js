const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

const createUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().toLowerCase(),
    phone: z.string().trim().min(7).max(20),
    password: z.string().min(8).max(128),
    role: z.enum(["staff", "field_worker", "admin"]),
    department: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
  })
  .superRefine((data, context) => {
    if (data.role !== "admin" && !data.department) {
      context.addIssue({
        code: "custom",
        path: ["department"],
        message: "Department is required for staff and field workers"
      });
    }
  });

module.exports = {
  registerSchema,
  loginSchema,
  createUserSchema
};