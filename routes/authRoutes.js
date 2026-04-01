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
import {
  findUserById,
} from "../models/userModel.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import{ getAllUsers, toggleUserStatus,  deleteUser,  searchUsers } from "../controllers/adminController.js"
const router = express.Router();

// -------------------------------------------------------
//---------------------- PUBLIC ROUTES---------------------
// ---------------------------------------------------------
router.post("/register", registerStudent);
router.post("/login", login);

// -------------------------------------------------------------
// -------------PROTECTED ROUTES (Logged-in users)--------------
// --------------------------------------------------------------

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

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

export default router;
