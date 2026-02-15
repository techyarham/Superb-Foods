import { Router } from "express";
import {
  getAllProducts,
  createProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authorize } from "../middlewares/authorize";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getAllProducts);
router.post("/", authorize, upload.single("image"), createProduct);
router.put("/:id", authorize, upload.single("image"), updateProduct);
router.get("/:id", getProductByID);
router.delete("/:id", authorize, deleteProduct);

export default router;
