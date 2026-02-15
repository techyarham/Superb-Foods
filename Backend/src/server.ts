import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import productRoutes from "./routes/products.route";
import userRoutes from "./routes/user.route";
import cartRoutes from "./routes/cart.route";
import orderRoutes from "./routes/order.route";
import authRoutes from "./routes/auth.route";
import { logger } from "./middlewares/logger";



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:8080", 
  credentials: true  // THIS IS CRITICAL for cookies
}));
app.use(helmet());
app.use(logger);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", authRoutes);

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

connectDB();

app.listen(3000, () => {
  console.log("Server running on port 3000", new Date().toLocaleString());
});
