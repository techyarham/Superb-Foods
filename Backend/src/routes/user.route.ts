import { Router } from "express";
import { createUser, getProfile, deleteUser, getAllUsers, getUserById, updateUser, verifyEmail } from '../controllers/user.controller';
import { authorize } from "../middlewares/authorize";

const router = Router();

router.get("/me", authorize, getProfile);
router.get("/", authorize, getAllUsers);
router.post("/", createUser);
router.put("/:id", authorize, updateUser);
router.get("/:id", authorize, getUserById);
router.delete("/:id", authorize, deleteUser);
router.post("/verify", verifyEmail);   // ← add this line

export default router;
