import pool from "../config/db.js";
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
