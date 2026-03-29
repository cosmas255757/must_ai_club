import express from "express";
import {
  addEvent,
  getEvent,
  listEvents,
  editEvent,
  removeEvent,
  joinEvent,
  leaveEvent,
  getParticipants,
  myEvents,
} from "../controllers/eventController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
router.get("/", listEvents);        // Anyone can see the list of events
router.get("/:id", getEvent);       // Anyone can see event details

// -------------------------
// PROTECTED ROUTES (Logged-in Users Only)
// -------------------------
router.use(protect); // All routes below this line require a valid JWT token

// --- Management (Facilitators & Admin Only) ---
// Only staff can create, update, or delete events
router.post("/", authorizeRoles("facilitator", "admin"), addEvent);       
router.put("/:id", authorizeRoles("facilitator", "admin"), editEvent);      
router.delete("/:id", authorizeRoles("facilitator", "admin"), removeEvent); 

// --- Participation (Students, Sponsors, etc.) ---
router.post("/join", joinEvent);    // Adds a record to 'event_participants'
router.post("/leave", leaveEvent);  // Removes a record from 'event_participants'

// View personal schedule
router.get("/me/events", myEvents);

// --- Admin/Facilitator View ---
router.get("/:eventId/participants", authorizeRoles("facilitator", "admin"), getParticipants);

export default router;
