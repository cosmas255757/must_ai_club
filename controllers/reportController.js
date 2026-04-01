import * as ReportModel from "../models/reportModel.js";

export const getSystemReport = async (req, res) => {
  try {
    const stats = await ReportModel.getAdminStats();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("Error in getSystemReport:", error.message);
    
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch analytics data.",
      error: error.message
    });
  }
};
