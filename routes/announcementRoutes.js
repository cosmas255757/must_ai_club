import express from "express";
import {  postAnnouncement,  getAnnouncement,  listAnnouncements,  editAnnouncement,  removeAnnouncement, } from "../controllers/announcementController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
router.get("/", listAnnouncements);      
router.get("/:id", getAnnouncement);     

// -------------------------
// PROTECTED ROUTES (Facilitators/Admin)
// -------------------------
router.post("/", authenticate, postAnnouncement);          
router.put("/:id", authenticate, editAnnouncement);       
router.delete("/:id", authenticate, removeAnnouncement); 

export default router;
