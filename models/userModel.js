import pool from "../config/db.js";

// -------------------------
// CREATE STUDENT (DEFAULT)
// -------------------------
export const createStudent = async (name, email, password) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, 'student')
    RETURNING id, name, email, role, status, created_at
  `;
  const values = [name, email, password];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// -------------------------
// CREATE USER BY ADMIN
// -------------------------
export const createUserByAdmin = async (name, email, password, role) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, status, created_at
  `;
  const values = [name, email, password, role];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// -------------------------
// FIND USER BY EMAIL
// -------------------------
export const findUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password, role, status, created_at
    FROM users
    WHERE email = $1
  `;
  const result = await pool.query(query, [email]);

  return result.rows[0];
};

// -------------------------
// FIND USER BY ID
// -------------------------
export const findUserById = async (id) => {
  const query = `
    SELECT id, name, email, role, status, created_at
    FROM users
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);

  return result.rows[0];
};
