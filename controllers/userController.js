import * as UserModel from '../models/userModel.js';

//  1. GET CURRENT USER PROFILE (Self)
export const getMyProfile = async (req, res) => {
    try {
        // req.user.user_id comes from your verifyToken/auth middleware
        const user = await UserModel.findUserById(req.user.user_id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User profile not found' 
            });
        }

        // Returns: full_name, username, email, student_id_number, github_url, 
        // phone_number, department, bio, roles (array), and permissions (array)
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get Profile Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error while fetching profile' 
        });
    }
};


// ✅ 2. UPDATE PROFILE (Self)
export const updateMyProfile = async (req, res) => {
    try {
        // Destructure all fields from req.body to match the new logic
        const { 
            username, 
            email, 
            phone_number, 
            full_name, 
            department, 
            bio, 
            github_url, 
            student_id_number 
        } = req.body;
        
        // Pass the full data object to the model
        const updatedProfile = await UserModel.updateUserProfile(req.user.user_id, {
            username,
            email,
            phone_number,
            full_name,
            department,
            bio,
            github_url,
            student_id_number
        });

        res.status(200).json({ 
            success: true,
            message: 'Profile updated successfully', 
            data: updatedProfile 
        });

    } catch (error) {
        console.error('Update Profile Error:', error.message);

        // 23505 is the Postgres code for Unique Violation (Email, Username, or Student ID)
        if (error.code === '23505') {
            let field = "Information";
            if (error.detail.includes('email')) field = "Email";
            if (error.detail.includes('username')) field = "Username";
            if (error.detail.includes('student_id_number')) field = "Student ID";
            
            return res.status(400).json({ 
                success: false, 
                message: `${field} already exists. Please use another one.` 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Error updating profile. Please try again later.' 
        });
    }
};


// ✅ 3. GET ALL USERS (Superadmin/Staff View)
export const getAllUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const users = await UserModel.getAllUsers(limit, offset);
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Fetch Users Error:', error);
        res.status(500).json({ message: 'Error fetching users list' });
    }
};


// ✅ 4. GET SPECIFIC USER BY ID (Admin View)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

// ✅ 5. TOGGLE USER STATUS (Activate/Deactivate)
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        // Validation
        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ message: 'is_active must be a boolean' });
        }

        const updated = await UserModel.updateUserStatus(id, is_active);

        // Since the model returns result.rows, we check if the first element exists
        if (!updated || updated.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: `User ${is_active ? 'activated' : 'deactivated'} successfully`, 
            // Returns: { user_id, status }
            data: updated[0] 
        });
    } catch (error) {
        console.error('Toggle Status Error:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q, limit = 10, offset = 0 } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const users = await UserModel.searchMembers(q, parseInt(limit), parseInt(offset));
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ message: 'Error performing search' });
    }
};
