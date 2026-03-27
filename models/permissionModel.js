import pool from '../config/db.js';

// ✅ 1. CREATE PERMISSION (Add a new action key to the system)
export const createPermission = async (permissionData) => {
    const { permission_key, description } = permissionData;
    const result = await pool.query(
        `INSERT INTO permissions (permission_key, description)
         VALUES ($1, $2)
         ON CONFLICT (permission_key) DO UPDATE 
         SET description = EXCLUDED.description
         RETURNING *`,
        [permission_key.toUpperCase(), description]
    );
    return result.rows[0];
};

// ✅ 2. GET ALL PERMISSIONS (Master list for Admin UI)
export const getAllPermissions = async () => {
    const result = await pool.query(
        `SELECT * FROM permissions ORDER BY permission_key ASC`
    );
    return result.rows;
};

// ✅ 3. FIND PERMISSION BY KEY
export const findPermissionByKey = async (permission_key) => {
    const result = await pool.query(
        `SELECT * FROM permissions WHERE permission_key = $1`,
        [permission_key.toUpperCase()]
    );
    return result.rows[0];
};

// ✅ 4. UPDATE PERMISSION DESCRIPTION
export const updatePermission = async (permission_id, description) => {
    const result = await pool.query(
        `UPDATE permissions 
         SET description = $1 
         WHERE permission_id = $2 
         RETURNING *`,
        [description, permission_id]
    );
    return result.rows[0];
};

// ✅ 5. DELETE PERMISSION (Global Cleanup)
// Due to ON DELETE CASCADE in your schema, this removes it from all roles automatically
export const deletePermission = async (permission_id) => {
    await pool.query('DELETE FROM permissions WHERE permission_id = $1', [permission_id]);
    return { success: true, message: 'Permission removed from system and all associated roles' };
};

// ✅ 6. SEED PERMISSIONS (Utility for initial setup)
export const seedPermissions = async (permissionsArray) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const p of permissionsArray) {
            await client.query(
                `INSERT INTO permissions (permission_key, description) 
                 VALUES ($1, $2) ON CONFLICT (permission_key) DO NOTHING`,
                [p.key.toUpperCase(), p.description]
            );
        }
        await client.query('COMMIT');
        return { success: true, message: 'Permissions seeded successfully' };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
