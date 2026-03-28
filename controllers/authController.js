import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createStudent, findUserByEmail, createUserByAdmin, findUserById } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// -------------------------
// STUDENT REGISTRATION
// -------------------------
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createStudent(name, email, hashedPassword);

    res.status(201).json({ message: "Student registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// ADMIN REGISTRATION (Facilitator or Sponsor)
// -------------------------
export const registerUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const adminUserId = req.user.id;

    const adminUser = await findUserById(adminUserId);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validRoles = ["facilitator", "sponsor"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUserByAdmin(name, email, hashedPassword, role);

    res.status(201).json({ message: `${role} registered successfully`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LOGIN
// -------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: `User is ${user.status}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
