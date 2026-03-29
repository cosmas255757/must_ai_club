import express from "express";
import {
  createReview,
  getReview,
  getReviewsByProject,
  getReviewsByFacilitator,
  editReview,
  removeReview,
} from "../controllers/projectReviewController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PROTECTED ROUTES (Logged-in Only)
// -------------------------
router.use(protect);

// --- Review Creation & Management (Facilitators & Admin Only) ---
// Only staff can submit a formal review or feedback in the project_reviews table
router.post("/", authorizeRoles("facilitator", "admin"), createReview);
router.put("/:id", authorizeRoles("facilitator", "admin"), editReview);
router.delete("/:id", authorizeRoles("facilitator", "admin"), removeReview);

// --- Viewing Reviews (Staff & Students) ---
// Students can see reviews for specific projects, Facilitators can see their own review history
router.get("/project/:projectId", getReviewsByProject);
router.get("/facilitator/me", authorizeRoles("facilitator", "admin"), getReviewsByFacilitator);
router.get("/:id", getReview);

export default router;
