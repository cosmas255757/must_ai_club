import express from "express";
import {
  createSponsorship,
  getSponsorship,
  listSponsorships,
  editSponsorship,
  removeSponsorship,
 // mySponsorships,
} from "../controllers/sponsorshipController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PROTECTED ROUTES (Logged-in Only)
// -------------------------
router.use(protect);

// --- Creating & Managing (Sponsors & Admin Only) ---
// Only a 'sponsor' can create a record in the sponsorships table.
// The 'sponsor_id' will be automatically set from req.user.id in the controller.
router.post("/", authorizeRoles("sponsor", "admin"), createSponsorship);
router.put("/:id", authorizeRoles("sponsor", "admin"), editSponsorship);
router.delete("/:id", authorizeRoles("sponsor", "admin"), removeSponsorship);

// --- Viewing Sponsorships ---
// Admins see all contributions; Sponsors see their own history.
router.get("/", authorizeRoles("admin"), listSponsorships); 
//router.get("/me", authorizeRoles("sponsor"), mySponsorships);
router.get("/:id", getSponsorship);

export default router;
