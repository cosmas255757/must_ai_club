import express from "express";
import {
  addProject,
  getProject,
  listProjects,
  editProject,
  removeProject,
} from "../controllers/projectController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PROTECTED ROUTES (Logged-in Only)
// -------------------------
router.use(protect); 

// --- Submission (Students Only) ---
// Only students should be able to submit new projects to the 'projects' table
router.post("/", authorizeRoles("student"), addProject);       

// --- Viewing Projects ---
// Students see their own, Facilitators/Admins see all for grading
router.get("/", listProjects);        
router.get("/:id", getProject);        

// --- Management (Student Owner or Admin) ---
// Students edit their own submissions; Admins can manage any project
router.put("/:id", editProject);       
router.delete("/:id", removeProject);  

export default router;
