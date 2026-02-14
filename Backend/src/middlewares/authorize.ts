import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  // First try to get token from cookie
  const token = req.cookies.token;
  
  // If no token in cookie, try Authorization header (for backward compatibility)
  // const headerToken = req.headers.authorization?.split(" ")[1];
  // const finalToken = token || headerToken;
  
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Authorization Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
