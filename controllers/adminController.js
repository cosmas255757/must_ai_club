import { 
  toggleUserStatusModel, 
  getAllUsersModel, 
  deleteUserModel, 
  searchUsersModel  
} from "../models/userModel.js";
import pool from "../config/db.js";
import * as AdminModel from "../models/adminModel.js";


//------------------------------------------------------------------------------------------------------
//-------------------------------------------GET ALL USERS------------------------------------------------
//--------------------------------------------------------------------------------------------------------
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

//-------------------------------------------------------------------------------------------------------
//---------------------------------CHANGE USER STATUS---------------------------------------------------
//-------------------------------------------------------------------------------------------------------
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStatus } = req.body;
    const newStatus = currentStatus === "active" ? "suspended" : "active";

    const updatedUser = await toggleUserStatusModel(id, newStatus);
    
    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)",
      [req.user.id, `Admin ${newStatus === 'active' ? 'activated' : 'suspended'} user ID: ${id}`]
    );

    res.status(200).json({ success: true, message: `User is now ${newStatus}`, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//---------------------------------------------------------------------------------------------------
//---------------------------DELETE USER------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUserModel(id);

    await pool.query(
      "INSERT INTO activity_logs (user_id, action) VALUES ($1, $2)",
      [req.user.id, `Admin permanently deleted user ID: ${id}`]
    );

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//------------------------------------------------------------------------------------------------------
//---------------------------SEARCH USER--------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------
export const searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No search term provided"
      });
    }

    const users = await searchUsersModel(searchTerm);

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

//--------------------------------------------------------------------------------
//--------------------------------GET ADMIN PROFILE--------------------------------
//-------------------------------------------------------------------------------------
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const adminData = await AdminModel.getAdminProfile(adminId);

    if (!adminData) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found."
      });
    }
    res.status(200).json({
      success: true,
      data: adminData
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
//-----------------------------------------------------------------------------------
// -------------------------------UPDATE PROFILE CONTROLLER-----------------------
//----------------------------------------------------------------------------------
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email } = req.body;

    const updatedAdmin = await AdminModel.updateAdminProfile(adminId, { name, email });

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedAdmin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//----------------------------------------------------------------------------------------
// ---------------------------RESET PASSWORD CONTROLLER-----------------------------------
//----------------------------------------------------------------------------------------
export const updateAdminPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be new at least 6 characters" });
    }

    const result = await AdminModel.updateAdminPassword(adminId, newPassword);

    if (!result) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
