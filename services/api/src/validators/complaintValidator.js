const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const locationSchema = z
  .object({
    type: z.literal("Point").optional(),
    coordinates: z.tuple([z.number(), z.number()])
  })
  .superRefine((location, context) => {
    const [longitude, latitude] = location.coordinates;

    if (longitude < -180 || longitude > 180) {
      context.addIssue({
        code: "custom",
        path: ["coordinates", 0],
        message: "Longitude must be between -180 and 180"
      });
    }

    if (latitude < -90 || latitude > 90) {
      context.addIssue({
        code: "custom",
        path: ["coordinates", 1],
        message: "Latitude must be between -90 and 90"
      });
    }
  });

const createComplaintSchema = z.object({
  category: objectId,
  title: z.string().trim().min(5).max(150),
  description: z.string().trim().min(10).max(2000),
  location: locationSchema,
  priority: z.enum(["Low", "Normal", "High", "Urgent"]).optional()
});

module.exports = {
  createComplaintSchema
};
