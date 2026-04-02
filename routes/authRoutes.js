import express from "express";
import {
  registerStudent,
  registerUserByAdmin,
  getDashboardStats,
  getRecentActivityLogs,
  login,
  clearCache,
  backupDatabase,
  emergencyLockdown
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import{ getAllUsers, toggleUserStatus,  deleteUser,  searchUsers, getAdminProfile } from "../controllers/adminController.js"
import { getSystemReport } from "../controllers/reportController.js";

const router = express.Router();

// -------------------------------------------------------
//---------------------- PUBLIC ROUTES---------------------
// ---------------------------------------------------------
router.post("/register", registerStudent);
router.post("/login", login);

// ---------------------------------------------------
// ----------------ADMIN ONLY ROUTES-------------------
// --------------------------------------------------

router.post("/admin/create", protect, authorizeRoles("admin"), registerUserByAdmin);

router.get(  "/dashboard-stats",  protect,  authorizeRoles("admin"),  getDashboardStats);

router.post("/backup", protect, authorizeRoles("admin"), backupDatabase);

router.post("/clear-cache", protect, authorizeRoles("admin"), clearCache);

router.post("/lockdown", protect, authorizeRoles("admin"), emergencyLockdown);

router.get(  "/logs",  protect,  authorizeRoles("admin"),  getRecentActivityLogs);

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

router.patch("/users/:id/status", protect, authorizeRoles("admin"), toggleUserStatus);

router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

router.get("/users/search", protect, authorizeRoles("admin"), searchUsers);

router.post("/register-admin", protect, authorizeRoles("admin"), registerUserByAdmin);

router.get("/admin/reports", protect, authorizeRoles("admin"), getSystemReport);

router.get("/admin/profile", protect, authorizeRoles("admin"), getAdminProfile);

export default router;
