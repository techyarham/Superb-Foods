import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  });

export const addToCartZod = z.object({
  productID: objectIdSchema,
  quantity: z
    .number()
    .int("Quantity must be integer")
    .min(1, "Quantity must be at least 1"),
});

export const updateQuantityZod = z.object({
  id: objectIdSchema,
  quantity: z.number().int("Quantity must be integer"),
});

export const cartParams = z.object({
  productID: objectIdSchema,
});
