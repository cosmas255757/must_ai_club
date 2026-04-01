import { toggleUserStatusModel, getAllUsersModel, deleteUserModel  } from "../models/userModel.js";
import pool from "../config/db.js";


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
