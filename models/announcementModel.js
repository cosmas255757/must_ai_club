// src/models/announcementModel.js

import pool from "../config/db.js";

// -------------------------
// ANNOUNCEMENTS
// -------------------------

export const createAnnouncement = async (title, message, creatorId) => {
  const query = `
    INSERT INTO announcements (title, message, created_by)
    VALUES ($1, $2, $3)
    RETURNING id, title, message, created_by, created_at
  `;
  const values = [title, message, creatorId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAnnouncementById = async (announcementId) => {
  const query = `
    SELECT a.id, a.title, a.message, a.created_by, a.created_at, u.name AS creator_name
    FROM announcements a
    JOIN users u ON a.created_by = u.id
    WHERE a.id = $1
  `;
  const result = await pool.query(query, [announcementId]);
  return result.rows[0];
};

export const listAllAnnouncements = async () => {
  const query = `
    SELECT a.id, a.title, a.message, a.created_by, a.created_at, u.name AS creator_name
    FROM announcements a
    JOIN users u ON a.created_by = u.id
    ORDER BY a.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updateAnnouncement = async (announcementId, title, message) => {
  const query = `
    UPDATE announcements
    SET title = $2,
        message = $3
    WHERE id = $1
    RETURNING id, title, message, created_by, created_at
  `;
  const values = [announcementId, title, message];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteAnnouncement = async (announcementId) => {
  const query = `
    DELETE FROM announcements
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [announcementId]);
  return result.rows[0];
};
