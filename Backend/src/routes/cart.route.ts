import { addToCart, clearCart, getCart, removeItem, updateQuantity } from '../controllers/cart.controller';
import { Router } from 'express';
import { authorize } from '../middlewares/authorize';

const router = Router();

// Delete item by productID (matches validation schema)
router.delete("/:productID", authorize, removeItem);

// Get cart
router.get("/", authorize, getCart);

// Add to cart
router.post("/", authorize, addToCart);

// Clear cart
router.delete("/", authorize, clearCart);

// Update quantity
router.put("/", authorize, updateQuantity);

export default router;
