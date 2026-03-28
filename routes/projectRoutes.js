// src/routes/projectRoutes.js

import express from "express";
import {
  addProject,
  getProject,
  listProjects,
  editProject,
  removeProject,
} from "../controllers/projectController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------------
// PROTECTED ROUTES
// -------------------------
router.use(authenticate); 

router.post("/", addProject);       
router.get("/", listProjects);        
router.get("/:id", getProject);        
router.put("/:id", editProject);       
router.delete("/:id", removeProject);  

export default router;
