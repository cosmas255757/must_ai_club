import {
  addReview,
  getReviewById,
  listReviewsByProject,
  listReviewsByFacilitator,
  updateReview,
  deleteReview,
} from "../models/projectReviewModel.js";

import { getProjectById } from "../models/projectModel.js";

// -------------------------
// ADD REVIEW (Facilitator only)
// -------------------------
export const createReview = async (req, res) => {
  try {
    const { projectId, status, comments } = req.body;
    const user = req.user;

    if (!projectId || !status) {
      return res.status(400).json({ message: "Project ID and status are required" });
    }

    if (user.role !== "facilitator" && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only facilitators/admin can review projects" });
    }

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const review = await addReview(projectId, user.id, status, comments);

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// GET SINGLE REVIEW
// -------------------------
export const getReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LIST REVIEWS BY PROJECT
// -------------------------
export const getReviewsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const reviews = await listReviewsByProject(projectId);

    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LIST REVIEWS BY FACILITATOR
// -------------------------
export const getReviewsByFacilitator = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "facilitator" && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const reviews = await listReviewsByFacilitator(user.id);

    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// UPDATE REVIEW
// -------------------------
export const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    const user = req.user;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const existingReview = await getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      user.role !== "admin" &&
      existingReview.facilitator_id !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const review = await updateReview(id, status, comments);

    res.json({ message: "Review updated", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// DELETE REVIEW
// -------------------------
export const removeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const existingReview = await getReviewById(id);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (
      user.role !== "admin" &&
      existingReview.facilitator_id !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const review = await deleteReview(id);

    res.json({ message: "Review deleted", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
