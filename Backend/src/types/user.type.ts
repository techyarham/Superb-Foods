import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  role: "admin" | "user";
  otp: string | null;
  otpExpiry: Date | null;  
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}
