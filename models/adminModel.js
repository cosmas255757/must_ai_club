import pool from "../config/db.js";
import bcrypt from "bcrypt";
//---------------------------------------------------------------------------------------------------
//-----------------------------GET ADMIN PROFILE-----------------------------------------------------
//---------------------------------------------------------------------------------------------------
export const getAdminProfile = async (adminId) => {
  const query = `
     SELECT id, name, email, role, status, created_at 
    FROM users 
    WHERE id = $1 AND role = 'admin'::user_role
    LIMIT 1;
  `;

  try {
    const result = await pool.query(query, [adminId]);
    return result.rows[0] || null; 
  } catch (error) {
    throw new Error("Database error while fetching admin profile: " + error.message);
  }
};


//----------------------------------------------------------------------------------------------
// -----------------------------UPDATE GENERAL PROFILE (Name, Email)---------------------------
//--------------------------------------------------------------------------------------------
export const updateAdminProfile = async (adminId, { name, email }) => {
  const query = `
    UPDATE users 
    SET name = $1, email = $2 
    WHERE id = $3 AND role = 'admin'::user_role
    RETURNING id, name, email, role, status, created_at;
  `;
  const result = await pool.query(query, [name, email, adminId]);
  return result.rows[0];
};
//----------------------------------------------------------------------------------------------
//----------------------------- UPDATE PASSWORD ONLY-------------------------------------------
//----------------------------------------------------------------------------------------------
export const updateAdminPassword = async (adminId, newPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const query = `
    UPDATE users 
    SET password = $1 
    WHERE id = $2 AND role = 'admin'::user_role
    RETURNING id;
  `;
  const result = await pool.query(query, [hashedPassword, adminId]);
  return result.rows[0];
};
