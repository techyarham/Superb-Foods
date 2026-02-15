import express from "express";
import { loginUser, refreshToken, logoutUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", loginUser);
router.get("/refresh", refreshToken);
router.post("/logout", logoutUser);

export default router;
