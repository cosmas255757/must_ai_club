// src/models/sponsorshipModel.js

import pool from "../config/db.js";

// -------------------------
// SPONSORSHIPS
// -------------------------

export const addSponsorship = async (sponsorId, amount, type, description) => {
  const query = `
    INSERT INTO sponsorships (sponsor_id, amount, type, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id, sponsor_id, amount, type, description, created_at
  `;
  const values = [sponsorId, amount, type, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getSponsorshipById = async (sponsorshipId) => {
  const query = `
    SELECT id, sponsor_id, amount, type, description, created_at
    FROM sponsorships
    WHERE id = $1
  `;
  const result = await pool.query(query, [sponsorshipId]);
  return result.rows[0];
};

export const listAllSponsorships = async () => {
  const query = `
    SELECT s.id, s.sponsor_id, s.amount, s.type, s.description, s.created_at, u.name AS sponsor_name, u.email AS sponsor_email
    FROM sponsorships s
    JOIN users u ON s.sponsor_id = u.id
    ORDER BY s.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updateSponsorship = async (sponsorshipId, amount, type, description) => {
  const query = `
    UPDATE sponsorships
    SET amount = $2,
        type = $3,
        description = $4
    WHERE id = $1
    RETURNING id, sponsor_id, amount, type, description, created_at
  `;
  const values = [sponsorshipId, amount, type, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteSponsorship = async (sponsorshipId) => {
  const query = `
    DELETE FROM sponsorships
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [sponsorshipId]);
  return result.rows[0];
};
