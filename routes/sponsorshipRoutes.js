import express from "express";
import {
  createSponsorship,
  getSponsorship,
  listSponsorships,
  editSponsorship,
  removeSponsorship,
} from "../controllers/sponsorshipController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PROTECTED ROUTES
// -------------------------
router.use(authenticate);

router.post("/", createSponsorship);

router.get("/", listSponsorships);

router.get("/:id", getSponsorship);

router.put("/:id", editSponsorship);

router.delete("/:id", removeSponsorship);

export default router;
