import pool from "../config/db.js";

// ----------------------------------------------------------------------------------
// -------------------------CREATE STUDENT (DEFAULT SIGNUP)-----------------------
// ----------------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------------
// ----------------------------CREATE USER BY ADMIN (ANY ROLE)------------------------
// -----------------------------------------------------------------------------------
export const createUserByAdmin = async (name, email, hashedPassword, role) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, status, created_at
  `;
  const values = [name, email, hashedPassword, role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// -------------------------------------------------------------------------
//----------------------- FIND USER BY EMAIL (FOR AUTH)--------------------
// -------------------------------------------------------------------------
export const findUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password, role, status, created_at
    FROM users
    WHERE email = $1
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// ---------------------------------------------------------------------
// --------------------------FIND USER BY ID---------------------------
// ---------------------------------------------------------------------
export const findUserById = async (id) => {
  const query = `
    SELECT id, name, email, role, status, created_at
    FROM users
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// ------------------------------------------------------------------------------------
// ---------------------UPDATE USER STATUS (SUSPEND/ACTIVE)----------------------------
// -----------------------------------------------------------------------------------
export const updateUserStatus = async (id, status) => {
  const query = `
    UPDATE users
    SET status = $2
    WHERE id = $1
    RETURNING id, name, status
  `;
  const result = await pool.query(query, [id, status]);
  return result.rows[0];
};

// ----------------------------------------------------------------------------
// ------------------GET ALL USERS (ADMIN VIEW)---------------------------------
// -----------------------------------------------------------------------------
export const getAllUsers = async () => {
  const query = `
    SELECT id, name, email, role, status, created_at 
    FROM users 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ----------------------------------------------------------------------
// ------------------------------DELETE USER-----------------------------
// ----------------------------------------------------------------------
export const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
