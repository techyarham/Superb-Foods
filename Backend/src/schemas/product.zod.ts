import mongoose from "mongoose";
import z from "zod";

export const productZod = z.object({
  name: z.string().min(3, "enter valid name"),
  description: z.string(),
  price: z.coerce.number().min(0, "price must be greater than 0"),
  category: z.string(),
});

export const updateProductZod = productZod
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Send Atleast 1 field",
  });

export const productParams = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  }),
});
