import mongoose from "mongoose";
import z from "zod";

export const UserZod = z.object({
  name: z.string().min(3, "Invalid Name"),
  email: z.string().email(),
  password: z.string().min(8, "Minimum 8 characters allowed"),
});

export const updateUserZod = UserZod.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Send Atleast 1 field",
  }
);

export const userParams = z.object({
  id: z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid user ID",
    })
});

export const loginZod = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Minimum 8 characters allowed"),
});

export const verifyEmailZod = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "Enter 6 numbers only").max(6, "Enter 6 numbers only")
});
