import { Request, Response } from "express";
import { User } from "../models/user.model";
import { verifyPass } from "../utils/bcrypt";
import { generateToken, generateRefreshToken, Payload, verifyRefreshToken } from "../utils/jwt";
import { sendEmail } from "../utils/email";
import { verifyEmail, loginAlertEmail } from "../templates/email.template";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Email verification check
    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await User.findByIdAndUpdate(user.id, { otp, otpExpiry: expiry });

      await sendEmail({
        to: user.email,
        html: verifyEmail({ name: user.name, otp }),
        subject: "Verify Your Email!",
        text: "Verify your email now to order our delicious foods!",
      });

      return res.status(401).json({ message: "Email not verified, OTP sent" });
    }

    // Password check
    const isValid = await verifyPass(password, user.password!);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    // JWT + Refresh token
    const payload: Payload = { id: user.id, email: user.email, role: user.role };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Set both tokens as HTTP-only cookies with path="/"
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Send login alert (non-blocking)
    await sendEmail({
      to: user.email,
      html: loginAlertEmail({
        name: user.name,
        device: req.headers["user-agent"] || "Unknown",
        loginTime: new Date().toLocaleTimeString(),
      }),
      subject: "Login Alert",
      text: "Your account just logged in",
    }).catch(() => {});

    return res.status(200).json({
      message: "Logged in successfully",
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Refresh token endpoint
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefreshToken(refreshToken);
    const newToken = generateToken({ id: payload.id, email: payload.email, role: payload.role });

    // Set new token as cookie with same options
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Logout
export const logoutUser = async (req: Request, res: Response) => {
  console.log("[LOGOUT] Called");
  try {
    console.log("[LOGOUT] Clearing cookies...");
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    console.log("[LOGOUT] Cookies cleared, sending response");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
