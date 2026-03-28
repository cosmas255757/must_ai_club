// src/routes/projectReviewRoutes.js

import express from "express";
import {
  createReview,
  getReview,
  getReviewsByProject,
  getReviewsByFacilitator,
  editReview,
  removeReview,
} from "../controllers/projectReviewController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PROTECTED ROUTES
// -------------------------
router.use(authenticate);

router.post("/", createReview);
router.get("/project/:projectId", getReviewsByProject);
router.get("/facilitator/me", getReviewsByFacilitator);
router.put("/:id", editReview);
router.delete("/:id", removeReview);
router.get("/:id", getReview);

export default router;
