import z from "zod";

export const addressZod = z.object({
  fullName: z.string().min(3, "Minimum 3 letters allowed"),
  deliveryAddress: z.string().min(10, "Give complete Address"),
  phone: z.string().min(11, "Enter valid Phone Number")
});

export const updateStatusZod = z.object({
  status: z.enum(["accepted", "rejected"]),
  estimatedTime: z.string().optional()
});
