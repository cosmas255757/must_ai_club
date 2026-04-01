import { getAllUsersModel } from "../models/userModel.js";

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
