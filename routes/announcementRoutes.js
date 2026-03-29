import express from "express";
import { 
  postAnnouncement, 
  getAnnouncement, 
  listAnnouncements, 
  editAnnouncement, 
  removeAnnouncement 
} from "../controllers/announcementController.js";

// Import the middleware we created
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
// Everyone (including guests) can see announcements
router.get("/", listAnnouncements);      
router.get("/:id", getAnnouncement);     

// -------------------------
// PROTECTED ROUTES (Facilitators/Admin Only)
// -------------------------
// 'protect' verifies the token, 'authorizeRoles' checks the ENUM role
router.post("/", protect, authorizeRoles("facilitator", "admin"), postAnnouncement);          
router.put("/:id", protect, authorizeRoles("facilitator", "admin"), editAnnouncement);       
router.delete("/:id", protect, authorizeRoles("facilitator", "admin"), removeAnnouncement); 

export default router;
