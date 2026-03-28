import {
  addSponsorship,
  getSponsorshipById,
  listAllSponsorships,
  updateSponsorship,
  deleteSponsorship,
} from "../models/sponsorshipModel.js";

// -------------------------
// ADD SPONSORSHIP (Sponsor only)
// -------------------------
export const createSponsorship = async (req, res) => {
  try {
    const { amount, type, description } = req.body;
    const user = req.user;

    if (!amount || !type) {
      return res.status(400).json({ message: "Amount and type are required" });
    }

    if (user.role !== "sponsor" && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const sponsorship = await addSponsorship(user.id, amount, type, description);

    res.status(201).json({ message: "Sponsorship added", sponsorship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// GET SINGLE SPONSORSHIP
// -------------------------
export const getSponsorship = async (req, res) => {
  try {
    const { id } = req.params;

    const sponsorship = await getSponsorshipById(id);
    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    res.json({ sponsorship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LIST ALL SPONSORSHIPS (Admin/Facilitator)
// -------------------------
export const listSponsorships = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "admin" && user.role !== "facilitator") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const sponsorships = await listAllSponsorships();

    res.json({ sponsorships });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// UPDATE SPONSORSHIP
// -------------------------
export const editSponsorship = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, description } = req.body;
    const user = req.user;

    const existing = await getSponsorshipById(id);
    if (!existing) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    if (
      user.role !== "admin" &&
      existing.sponsor_id !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const sponsorship = await updateSponsorship(id, amount, type, description);

    res.json({ message: "Sponsorship updated", sponsorship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// DELETE SPONSORSHIP
// -------------------------
export const removeSponsorship = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const existing = await getSponsorshipById(id);
    if (!existing) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    if (
      user.role !== "admin" &&
      existing.sponsor_id !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const sponsorship = await deleteSponsorship(id);

    res.json({ message: "Sponsorship deleted", sponsorship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
