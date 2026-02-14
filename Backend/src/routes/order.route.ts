import { Router } from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller";
import { authorize } from "../middlewares/authorize";

const router = Router();

// User creates order
router.post("/", authorize, createOrder);

// User views his orders
router.get("/my", authorize, getUserOrders);

// Admin views all orders with optional filter & sorting
router.get("/", authorize, getAllOrders);

// Admin updates order status
router.put("/:id/status", authorize, updateOrderStatus);

export default router;
