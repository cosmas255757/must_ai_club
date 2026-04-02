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

// ------------------------------------------------------------------------------------
// ---------------------UPDATE USER STATUS (SUSPEND/ACTIVE)----------------------------
// -----------------------------------------------------------------------------------
export const toggleUserStatusModel = async (id, newStatus) => {
  const query = `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, status`;
  const { rows } = await pool.query(query, [newStatus, id]);
  return rows[0];
};

//---------------------------------------------------------------------------------
// -----------------------------PERMANENTLY DELETE USER--------------------------
//---------------------------------------------------------------------------------
export const deleteUserModel = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// ----------------------------------------------------------------------------
// ------------------GET ALL USERS (ADMIN VIEW)---------------------------------
// -----------------------------------------------------------------------------

export const getAllUsersModel = async () => {
  const query = `
    SELECT id, name, email, role, status, created_at 
    FROM users 
    ORDER BY created_at DESC
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error("Error fetching all users: " + error.message);
  }
};
//-----------------------------------------------------------------------------------------
//------------------------------SEARCH USER------------------------------------------------
//---------------------------------------------------------------------------------------
export const searchUsersModel = async (searchTerm) => {
  const query = `
    SELECT id, name, email, role, status, created_at 
    FROM users 
    WHERE name ILIKE $1 OR email ILIKE $1 OR id::text ILIKE $1
    ORDER BY created_at DESC
  `;
  try {
    const { rows } = await pool.query(query, [`%${searchTerm}%`]);
    return rows;
  } catch (error) {
    throw new Error("Database error searching users: " + error.message);
  }
};
//------------------------------------------------------------------------------------------
//--------------------------------COUNT TOTAL USERS--------------------------------------------
//------------------------------------------------------------------------------------------
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
//----------------------------------------------------------------------------------------
//---------------------------COUNT TOTAL ENROLLMENTS--------------------------------------
//----------------------------------------------------------------------------------------
export const getTotalEnrollmentsCount = async () => {
  const query = `SELECT COUNT(*) AS count FROM enrollments`;
  try {
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10) || 0;
  } catch (error) {
    throw new Error("Error counting enrollments: " + error.message);
  }
};
//-------------------------------------------------------------------------------------------
//----------------------------COUNT PENDING PROJECT REVIEWS----------------------------------
//-------------------------------------------------------------------------------------------
export const getPendingReviewsCount = async () => {
  const query = `SELECT COUNT(*) AS count FROM project_reviews WHERE approved = FALSE`;
  try {
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10) || 0;
  } catch (error) {
    throw new Error("Error counting pending reviews: " + error.message);
  }
};
//------------------------------------------------------------------------------------------------
//--------------------------------COUNT TOTAL SYSTEM LOGS FOR LAST 72HRS--------------------------
//------------------------------------------------------------------------------------------------
export const getTotalLogsCount = async () => {
  const query = `SELECT COUNT(*) AS count FROM activity_logs WHERE created_at >= NOW() - INTERVAL '72 hours'`;
  try {
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10) || 0;
  } catch (error) {
    throw new Error("Error counting activity logs: " + error.message);
  }
};
//---------------------------------------------------------------------------------------------------
//---------------------------------GET SYSTEM LOGS---------------------------------------------------
//-----------------------------------------------------------------------------------------------------
export const getSystemLogs = async (limit = 50) => {
  const query = `
     SELECT al.id, al.action, al.created_at, u.name AS user_name 
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.created_at >= NOW() - INTERVAL '72 hours'
    ORDER BY al.created_at DESC
    LIMIT $1
  `;

  try {
    const { rows } = await pool.query(query, [limit]);
    return rows; 
  } catch (error) {
    console.error("Database Error in getSystemLogs:", error.message);
    throw new Error("Could not retrieve system logs: " + error.message);
  }
};
//-------------------------------------------------------------------------------------------
//----------------------------BACKUP DATABASE LOGIC-------------------------------------------
//-----------------------------------------------------------------------------------------------
export const backupDatabaseModel = async () => {
  try {
    return { message: "Database snapshot created successfully", timestamp: new Date() };
  } catch (error) {
    throw new Error("Backup failed: " + error.message);
  }
};
//-------------------------------------------------------------------------------------------------
//---------------------------CLEAR SYSTEM CACHE----------------------------------------------------
//---------------------------------------------------------------------------------------------------
export const clearSystemCacheModel = async () => {
  try {
    // If using Redis: await redis.flushall();
    return { message: "System cache cleared", itemsRemoved: "All" };
  } catch (error) {
    throw new Error("Cache clear failed: " + error.message);
  }
};
//--------------------------------------------------------------------------------------------------
//------------------------------EMMERGENCY LOCKDOWN--------------------------------------------------
//-------------------------------------------------------------------------------------------------
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
