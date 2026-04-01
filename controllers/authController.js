import bcrypt from "bcrypt";
import pool from "../config/db.js"; // To log the action
import jwt from "jsonwebtoken";
import { 
  createStudent, 
  findUserByEmail, 
  createUserByAdmin, 
  getTotalUsersCount, 
  getTotalEnrollmentsCount, 
  getPendingReviewsCount, 
  getTotalLogsCount,
  backupDatabaseModel, 
  clearSystemCacheModel, 
  findUserById,
  triggerLockdownModel,
  getSystemLogs
} from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// 1. STUDENT REGISTRATION
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Required fields missing" });

    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createStudent(name, email, hashedPassword);

    // --- LOG THE ACTION ---
    await pool.query("INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)", [user.id, "New student registered"]);

    res.status(201).json({ message: "You registered successfully as Student", user });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. ADMIN CREATE USER
export const registerUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // ... (Your existing validation logic here)

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserByAdmin(name, email, hashedPassword, role);

    // --- LOG THE ACTION ---
    await pool.query("INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)", [req.user.id, `Admin created a new ${role}: ${email}`]);

    res.status(201).json({ message: `${role} created successfully`, user });
  } catch (error) {
    console.error("Admin Create Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "User does not exist" });

    if (user.status !== "active") return res.status(403).json({ message: `Account is ${user.status}` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // --- LOG THE ACTION ---
    await pool.query("INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)", [user.id, "User logged in"]);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//--------------------------------------------------------------------------------
//=====================ADMIN COUNTS================================================
//---------------------------------------------------------------------------------

//get all 4 activity counts for the admin dashboard
export const getDashboardStats = async (req, res) => {
  try {
    // Execute all 4 count functions concurrently
    const [totalUsers, totalEnrollments, pendingReviews, totalLogs] = await Promise.all([
      getTotalUsersCount(),
      getTotalEnrollmentsCount(),
      getPendingReviewsCount(),
      getTotalLogsCount(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEnrollments,
        pendingReviews,
        totalLogs
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

export const getRecentActivityLogs = async (req, res) => {
  try {
    // 1. Sanitize the limit from the query string (e.g., ?limit=10)
    const limit = parseInt(req.query.limit, 10) || 50;

    // 2. Call the model to fetch data from PostgreSQL
    const logs = await getSystemLogs(limit);

    // 3. Return the response
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs || [] 
    });

  } catch (error) {
    console.error("Fetch Logs Error:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs from the database",
      error: error.message
    });
  }
};

// Database Backup
export const backupDatabase = async (req, res) => {
  try {
    const result = await backupDatabaseModel();
    
    // Log who did the backup
    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)",
      [req.user.id, "Admin triggered a full database backup"]
    );

    res.status(200).json({
      success: true,
      message: result.message,
      timestamp: result.timestamp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clearing Cache
export const clearCache = async (req, res) => {
  try {
    const result = await clearSystemCacheModel();
    
    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)",
      [req.user.id, "Admin cleared system cache"]
    );

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Emergency Lockdown
export const emergencyLockdown = async (req, res) => {
  try {
    const result = await triggerLockdownModel();
    
    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)",
      [req.user.id, `EMERGENCY LOCKDOWN: ${result.usersSuspended} users suspended`]
    );

    res.status(200).json({
      success: true,
      message: result.message,
      affectedUsers: result.usersSuspended
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
