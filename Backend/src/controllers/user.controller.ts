import { Request, Response } from "express";
import { User } from "../models/user.model";
import { hashPass } from "../utils/bcrypt";

// Create User
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await hashPass(password);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Create User Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get logged-in user profile
export const getProfile = async (req: Request, res: Response) => {
  console.log(`[PROFILE] Called with user id: ${req.user?.id}`);
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Prevent caching of profile data
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    
    console.log(`[PROFILE] Found user: ${user.email}`);
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user?.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hashPass(password);

    await user.save();
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Update User Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete user (soft delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = false;
    await user.save();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const users = await User.find({ isActive: true });
    return res.status(200).json({ users });
  } catch (err) {
    console.error("Get All Users Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get single user by id (admin only)
export const getUserById = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const user = await User.findById(req.params.id);
    if (!user || !user.isActive) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get User By ID Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, isActive: true }).select("+otp +otpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify Email Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
