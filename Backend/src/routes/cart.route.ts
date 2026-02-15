import { addToCart, clearCart, getCart, removeItem, updateQuantity } from '../controllers/cart.controller';
import { Router } from 'express';
import { authorize } from '../middlewares/authorize';

const router = Router();
router.delete("/:productID", authorize, removeItem);
router.get("/", authorize, getCart);
router.post("/", authorize, addToCart);
router.delete("/", authorize, clearCart);
router.put("/", authorize, updateQuantity);

export default router;
