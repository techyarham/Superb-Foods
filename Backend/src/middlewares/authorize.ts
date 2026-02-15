import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log(`[AUTHORIZE] Token from cookie: ${token ? 'present' : 'missing'}`);
  
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyToken(token);
    console.log(`[AUTHORIZE] Decoded user ID: ${decoded.id}`);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Authorization Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
