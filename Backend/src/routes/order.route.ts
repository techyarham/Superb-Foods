import { Router } from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/order.controller";
import { authorize } from "../middlewares/authorize";

const router = Router();
router.post("/", authorize, createOrder);
router.get("/my", authorize, getUserOrders);
router.get("/", authorize, getAllOrders);
router.put("/:id/status", authorize, updateOrderStatus);

export default router;
