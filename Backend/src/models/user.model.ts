import mongoose from "mongoose";
import { IUser } from "../types/user.type";

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, trim: true, required: true },
  password: { type: String, trim: true, required: true, select: false },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null }   // ← add this line
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", userSchema);
