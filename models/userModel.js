// src/models/userModel.js

import pool from "../config/db.js";

export const createStudent = async (name, email, hashedPassword) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, 'student')
    RETURNING id, name, email, role, status, created_at
  `;
  const values = [name, email, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const query = `SELECT id, name, email, role, status, created_at FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const listAllUsers = async () => {
  const query = `SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC`;
  const result = await pool.query(query);
  return result.rows;
};

export const updateUserStatus = async (id, status) => {
  const query = `
    UPDATE users
    SET status = $2
    WHERE id = $1
    RETURNING id, name, email, role, status
  `;
  const result = await pool.query(query, [id, status]);
  return result.rows[0];
};

export const createUserByAdmin = async (name, email, hashedPassword, role) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, status, created_at
  `;
  const result = await pool.query(query, [name, email, hashedPassword, role]);
  return result.rows[0];
};
