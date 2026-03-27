import pool from '../config/db.js';

// ✅ CREATE USER (Atomic Transaction: User + Profile + Role)
export const createUser = async (userData) => {
    const { username, email, phone_number, password_hash, full_name, role_name = 'Student', is_superadmin = false } = userData;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Insert into users table
        const userRes = await client.query(
            `INSERT INTO users (username, email, phone_number, password_hash, is_superadmin)
             VALUES ($1, $2, $3, $4, $5) RETURNING user_id`,
            [username, email, phone_number, password_hash, is_superadmin]
        );
        const userId = userRes.rows[0].user_id;

        // 2. Insert into user_profiles table
        await client.query(
            `INSERT INTO user_profiles (user_id, full_name) VALUES ($1, $2)`,
            [userId, full_name]
        );

        // 3. Assign Role (Subquery finds role_id by name)
        await client.query(
            `INSERT INTO user_roles (user_id, role_id) 
             SELECT $1, role_id FROM roles WHERE role_name = $2`,
            [userId, role_name]
        );

        await client.query('COMMIT');
        
        // Return the full user object (minus password)
        const finalUser = await client.query(`SELECT user_id, username, email, is_superadmin FROM users WHERE user_id = $1`, [userId]);
        return finalUser.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// ✅ FIND USER BY EMAIL (For Authentication)
export const findUserByEmail = async (email) => {
    const query = `
        SELECT u.*, 
               ARRAY_AGG(DISTINCT r.role_name) FILTER (WHERE r.role_name IS NOT NULL) AS roles,
               ARRAY_AGG(DISTINCT p.permission_key) FILTER (WHERE p.permission_key IS NOT NULL) AS permissions
        FROM users u
        LEFT JOIN user_roles ur ON u.user_id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.role_id
        LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.permission_id
        WHERE u.email = $1
        GROUP BY u.user_id`;
    
    const result = await pool.query(query, [email]);
    return result.rows[0]; 
};

// FIND USER BY ID (Detailed Profile with Permissions)
export const findUserById = async (user_id) => {
    const query = `
        SELECT 
            u.user_id, u.username, u.email, u.phone_number, u.is_active, u.is_superadmin,
            up.full_name, up.student_id_number, up.department, up.github_url, up.bio, up.profile_pic_url,
            ARRAY_AGG(DISTINCT r.role_name) FILTER (WHERE r.role_name IS NOT NULL) AS roles,
            ARRAY_AGG(DISTINCT p.permission_key) FILTER (WHERE p.permission_key IS NOT NULL) AS permissions
        FROM users u
        LEFT JOIN user_profiles up ON u.user_id = up.user_id
        LEFT JOIN user_roles ur ON u.user_id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.role_id
        LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
        LEFT JOIN permissions p ON rp.permission_id = p.permission_id
        WHERE u.user_id = $1
        GROUP BY u.user_id, up.profile_id`;

    const result = await pool.query(query, [user_id]);
    return result.rows[0];
};


// ✅ GET ALL USERS (Admin View)
export const getAllUsers = async (limit = 10, offset = 0) => {
    const query = `
        SELECT u.user_id, u.username, u.email, u.is_active, up.full_name, u.created_at
        FROM users u
        LEFT JOIN user_profiles up ON u.user_id = up.user_id
        ORDER BY u.created_at DESC
        LIMIT $1 OFFSET $2`;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
};

// ✅ UPDATE PROFILE DATA
// ✅ UPDATE USER & PROFILE (Transaction)
export const updateUserProfile = async (user_id, data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Update Core User Data (users table)
        const userUpdate = await client.query(
            `UPDATE users 
             SET username = COALESCE($1, username),
                 email = COALESCE($2, email),
                 phone_number = COALESCE($3, phone_number),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $4
             RETURNING username, email, phone_number`,
            [data.username, data.email, data.phone_number, user_id]
        );

        // 2. Update Extended Profile Data (user_profiles table)
        const profileUpdate = await client.query(
            `UPDATE user_profiles
             SET full_name = COALESCE($1, full_name), 
                 department = COALESCE($2, department), 
                 bio = COALESCE($3, bio), 
                 github_url = COALESCE($4, github_url),
                 student_id_number = COALESCE($5, student_id_number),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $6
             RETURNING full_name, department, bio, github_url, student_id_number`,
            [data.full_name, data.department, data.bio, data.github_url, data.student_id_number, user_id]
        );

        await client.query('COMMIT');

        // Merge results into one object for the response
        return { 
            ...userUpdate.rows[0], 
            ...profileUpdate.rows[0] 
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// ✅ TOGGLE USER STATUS (Deactivate/Activate)
export const updateUserStatus = async (user_id, is_active) => {
    const result = await pool.query(
        `UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING user_id, is_active`,
        [is_active, user_id]
    );
    return result.rows[0];
};
