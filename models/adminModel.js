import pool from "../config/db.js";

/**
 * Fetch detailed profile information for the Admin
 * @param {string} adminId - The UUID of the admin from the JWT
 */
export const getAdminProfile = async (adminId) => {
  const query = `
    SELECT 
      id, 
      name, 
      email, 
      role, 
      status, 
      created_at 
    FROM users 
    WHERE id = $1 AND role = 'admin' 
    LIMIT 1;
  `;

  try {
    const result = await pool.query(query, [adminId]);
    
    // Return the first row found
    return result.rows[0]; 
  } catch (error) {
    throw new Error("Database error while fetching admin profile: " + error.message);
  }
};
