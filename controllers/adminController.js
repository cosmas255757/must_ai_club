import { toggleUserStatusModel, getAllUsersModel, deleteUserModel, searchUsersModel  } from "../models/userModel.js";
import pool from "../config/db.js";
import * as AdminModel from "../models/adminModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStatus } = req.body;
    const newStatus = currentStatus === "active" ? "suspended" : "active";

    const updatedUser = await toggleUserStatusModel(id, newStatus);
    
    // Log the action
    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)",
      [req.user.id, `Admin ${newStatus === 'active' ? 'activated' : 'suspended'} user ID: ${id}`]
    );

    res.status(200).json({ success: true, message: `User is now ${newStatus}`, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUserModel(id);

    // Log the action
    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)",
      [req.user.id, `Admin permanently deleted user ID: ${id}`]
    );

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const searchUsers = async (req, res) => {
  try {
    // 1. Get the search term from the query parameter 'q'
    const searchTerm = req.query.q;

    // 2. If no search term is provided, return an empty array or all users
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No search term provided"
      });
    }

    // 3. Call the model function to query PostgreSQL
    const users = await searchUsersModel(searchTerm);

    // 4. Return the results
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error("Search Users Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to perform user search",
      error: error.message
    });
  }
};


export const getAdminProfile = async (req, res) => {
  try {
    // 1. req.user.id comes from your 'protect' middleware
    const adminId = req.user.id;

    // 2. Fetch data from our model
    const adminData = await AdminModel.getAdminProfile(adminId);

    // 3. Check if admin exists
    if (!adminData || adminData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found."
      });
    }

    // 4. Send back the real database data
    res.status(200).json({
      success: true,
      data: adminData[0]
    });

  } catch (error) {
    console.error("Error in getAdminProfile controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
