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

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PUBLIC ROUTES
// -------------------------
router.get("/", listEvents);        
router.get("/:id", getEvent);      
// -------------------------
// PROTECTED ROUTES
// -------------------------
router.use(authenticate);

router.post("/", addEvent);       
router.put("/:id", editEvent);      
router.delete("/:id", removeEvent); 

router.post("/join", joinEvent);    
router.post("/leave", leaveEvent);  

router.get("/:eventId/participants", getParticipants);

router.get("/me/events", myEvents);

export default router;
