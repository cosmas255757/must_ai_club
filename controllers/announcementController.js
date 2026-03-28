import { createAnnouncement, getAnnouncementById, listAllAnnouncements, updateAnnouncement, deleteAnnouncement } from "../models/announcementModel.js";

// -------------------------
// CREATE ANNOUNCEMENT
// -------------------------
export const postAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    const creatorId = req.user.id; // from authenticate middleware

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const announcement = await createAnnouncement(title, message, creatorId);

    res.status(201).json({ message: "Announcement created", announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// GET SINGLE ANNOUNCEMENT
// -------------------------
export const getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await getAnnouncementById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LIST ALL ANNOUNCEMENTS
// -------------------------
export const listAnnouncements = async (req, res) => {
  try {
    const announcements = await listAllAnnouncements();
    res.json({ announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// UPDATE ANNOUNCEMENT
// -------------------------
export const editAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;
    const userId = req.user.id;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const announcement = await updateAnnouncement(id, title, message);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement updated", announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// DELETE ANNOUNCEMENT
// -------------------------
export const removeAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await deleteAnnouncement(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted", announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
