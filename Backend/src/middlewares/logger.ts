import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Method:${req.method} Path:${req.url} Date:${new Date().toLocaleString()}`);
  next();
};
