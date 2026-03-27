import pool from '../config/db.js';

// ✅ 1. CREATE ROLE
export const createRole = async (roleData) => {
    const { role_name, description } = roleData;
    const result = await pool.query(
        `INSERT INTO roles (role_name, description)
         VALUES ($1, $2)
         RETURNING *`,
        [role_name, description]
    );
    return result.rows[0];
};

// ✅ 2. GET ALL ROLES
export const getAllRoles = async () => {
    const result = await pool.query(
        `SELECT * FROM roles ORDER BY role_name ASC`
    );
    return result.rows;
};

// ✅ 3. ASSIGN ROLE TO USER
export const assignRoleToUser = async (user_id, role_id) => {
    const result = await pool.query(
        `INSERT INTO user_roles (user_id, role_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, role_id) DO NOTHING
         RETURNING *`,
        [user_id, role_id]
    );
    return result.rows[0];
};

// ✅ 4. REMOVE ROLE FROM USER
export const removeRoleFromUser = async (user_id, role_id) => {
    await pool.query(
        `DELETE FROM user_roles
         WHERE user_id = $1 AND role_id = $2`,
        [user_id, role_id]
    );
    return { success: true, message: 'Role removed from user' };
};

// ✅ 5. GET ALL PERMISSIONS (The master list)
export const getAllPermissions = async () => {
    const result = await pool.query(
        `SELECT * FROM permissions ORDER BY permission_key ASC`
    );
    return result.rows;
};

// ✅ 6. ASSIGN PERMISSION TO ROLE
export const assignPermissionToRole = async (role_id, permission_id) => {
    const result = await pool.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)
         ON CONFLICT (role_id, permission_id) DO NOTHING
         RETURNING *`,
        [role_id, permission_id]
    );
    return result.rows[0];
};

// ✅ 7. REMOVE PERMISSION FROM ROLE
export const removePermissionFromRole = async (role_id, permission_id) => {
    await pool.query(
        `DELETE FROM role_permissions
         WHERE role_id = $1 AND permission_id = $2`,
        [role_id, permission_id]
    );
    return { success: true, message: 'Permission removed from role' };
};

// ✅ 8. GET ROLE PERMISSIONS (Joins permissions and role_permissions)
export const getRolePermissions = async (role_id) => {
    const result = await pool.query(
        `SELECT p.permission_id, p.permission_key, p.description
         FROM permissions p
         JOIN role_permissions rp ON p.permission_id = rp.permission_id
         WHERE rp.role_id = $1`,
        [role_id]
    );
    return result.rows;
};

// ✅ 9. GET FULL RBAC DATA FOR A USER (Calculated Roles + Permissions)
export const getUserRBAC = async (user_id) => {
    const query = `
        SELECT 
            u.is_superadmin,
            COALESCE(ARRAY_AGG(DISTINCT r.role_name) FILTER (WHERE r.role_name IS NOT NULL), '{}') AS roles,
            COALESCE(ARRAY_AGG(DISTINCT p.permission_key) FILTER (WHERE p.permission_key IS NOT NULL), '{}') AS permissions
        FROM users u
        LEFT JOIN user_roles ur ON u.user_id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.role_id
        LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.permission_id
        WHERE u.user_id = $1
        GROUP BY u.user_id`;
    
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
};


// ✅ 10. DELETE ROLE (Safe Delete)
export const deleteRole = async (role_id) => {
    await pool.query('DELETE FROM roles WHERE role_id = $1', [role_id]);
    return { success: true, message: 'Role and associated permissions assignments deleted' };
};
