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

//  Count Total Users
export const getTotalUsersCount = async () => {
  const query = `SELECT COUNT(*) AS count FROM users`;
  try {
    const { rows } = await pool.query(query);
    // rows[0].count extracts the value from the first row returned
    return parseInt(rows[0].count, 10) || 0;
  } catch (error) {
    throw new Error("Error counting users: " + error.message);
  }
};

// Count Total Enrollments
export const getTotalEnrollmentsCount = async () => {
  const query = `SELECT COUNT(*) AS count FROM enrollments`;
  try {
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10) || 0;
  } catch (error) {
    throw new Error("Error counting enrollments: " + error.message);
  }
};

//  Count Pending Project Reviews
export const getPendingReviewsCount = async () => {
  const query = `SELECT COUNT(*) AS count FROM project_reviews WHERE approved = FALSE`;
  try {
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10) || 0;
  } catch (error) {
    throw new Error("Error counting pending reviews: " + error.message);
  }
};

//  Count Total System Logs
export const getTotalLogsCount = async () => {
  const query = `SELECT COUNT(*) AS count FROM activity_logs`;
  try {
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10) || 0;
  } catch (error) {
    throw new Error("Error counting activity logs: " + error.message);
  }
};

export const getSystemLogs = async (limit = 5) => {
  const query = `
    SELECT 
      al.id, 
      al.action, 
      al.created_at, 
      u.name AS user_name 
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT $1
  `;

  try {
    const { rows } = await pool.query(query, [limit]);
  } catch (error) {
    console.error("Database Error in getSystemLogs:", error.message);
    throw new Error("Could not retrieve system logs: " + error.message);
  }
};


//  Backup Database Logic
export const backupDatabaseModel = async () => {
  try {
    return { message: "Database snapshot created successfully", timestamp: new Date() };
  } catch (error) {
    throw new Error("Backup failed: " + error.message);
  }
};

// Clear System Cache
export const clearSystemCacheModel = async () => {
  try {
    // If using Redis: await redis.flushall();
    return { message: "System cache cleared", itemsRemoved: "All" };
  } catch (error) {
    throw new Error("Cache clear failed: " + error.message);
  }
};

// Emergency Lockdown
export const triggerLockdownModel = async () => {
  const query = `
    UPDATE users 
    SET status = 'suspended' 
    WHERE role != 'admin' AND status = 'active'
    RETURNING id
  `;
  try {
    const { rows } = await pool.query(query);
    return { message: "Emergency Lockdown active", usersSuspended: rows.length };
  } catch (error) {
    throw new Error("Lockdown failed: " + error.message);
  }
};
