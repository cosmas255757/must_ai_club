import * as UserModel from '../models/userModel.js';

// ✅ 1. GET CURRENT USER PROFILE (Self)
export const getMyProfile = async (req, res) => {
    try {
        // req.user.user_id comes from the verifyToken middleware
        const user = await UserModel.findUserById(req.user.user_id);
        
        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get Profile Error:', error.message);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// ✅ 2. UPDATE PROFILE (Self)
export const updateMyProfile = async (req, res) => {
    try {
        const { full_name, department, bio, github_url, student_id_number } = req.body;
        
        const updatedProfile = await UserModel.updateUserProfile(req.user.user_id, {
            full_name,
            department,
            bio,
            github_url,
            student_id_number
        });

        res.status(200).json({ 
            message: 'Profile updated successfully', 
            profile: updatedProfile 
        });
    } catch (error) {
        console.error('Update Profile Error:', error.message);
        // Handle UNIQUE constraint error for student_id_number
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Student ID number already exists' });
        }
        res.status(500).json({ message: 'Error updating profile' });
    }
};

// ✅ 3. GET ALL USERS (Superadmin/Staff View)
export const getAllUsers = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const users = await UserModel.getAllUsers(parseInt(limit), parseInt(offset));
        res.status(200).json(users);
    } catch (error) {
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

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ message: 'is_active must be a boolean' });
        }

        const updated = await UserModel.updateUserStatus(id, is_active);

        if (!updated || updated.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: `User ${is_active ? 'activated' : 'deactivated'} successfully`, 
            data: updated 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status' });
    }
};
