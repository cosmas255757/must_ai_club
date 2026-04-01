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
  getAllUsers,
  findUserById,
  updateUserStatus,
  deleteUser
} from "../models/userModel.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import{ getAllUsers } from "../controllers/adminController.js"
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

router.get("/admin/users", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/admin/status/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body; // e.g., 'suspended' or 'active'
    const updatedUser = await updateUserStatus(req.params.id, status);

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User status updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/admin/user/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Get counts for users, enrollments, pending reviews, and logs
 * @access  Private (Admin only)
 */
router.get(
  "/dashboard-stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);


// -----------------------------------------------------------
// ----------------- ADMIN QUICK ACTIONS ---------------------
// -----------------------------------------------------------

router.post("/backup", protect, authorizeRoles("admin"), backupDatabase);

router.post("/clear-cache", protect, authorizeRoles("admin"), clearCache);

router.post("/lockdown", protect, authorizeRoles("admin"), emergencyLockdown);

router.get(  "/logs",  protect,  authorizeRoles("admin"),  getRecentActivityLogs);

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

export default router;
