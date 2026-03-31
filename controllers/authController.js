import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { 
  createStudent, 
  findUserByEmail, 
  createUserByAdmin, 
  getTotalUsersCount, 
  getTotalEnrollmentsCount, 
  getPendingReviewsCount, 
  getTotalLogsCount,
  getSystemLogs,
  findUserById 
} from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// -----------------------------------------------------------
// STUDENT REGISTRATION (Public - Defaults to 'student' role)
// -----------------------------------------------------------
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createStudent(name, email, hashedPassword);

    res.status(201).json({ 
      message: "You registered successfully as Student", 
      user 
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------------
// ADMIN CREATE USER (Private - For Admin to create any role)
// -----------------------------------------------------------
export const registerUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields including role are required" });
    }

    const validRoles = ["student", "facilitator", "sponsor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUserByAdmin(name, email, hashedPassword, role);

    res.status(201).json({ 
      message: `${role} created successfully`, 
      user 
    });
  } catch (error) {
    console.error("Admin Create Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------------
// -----------------------LOGIN------------------------------
// -----------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
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

//get the actual list of system logs
export const getRecentActivityLogs = async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const logs = await getSystemLogs(limit);

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
      error: error.message
    });
  }
};
