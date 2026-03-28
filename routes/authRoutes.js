import express from "express";
import { registerStudent, registerUserByAdmin, login } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
router.post("/register", registerStudent); 
router.post("/login", login);             

// -------------------------
// ADMIN ONLY ROUTES
// -------------------------
router.post("/register/admin", authenticate, registerUserByAdmin);

export default router;
