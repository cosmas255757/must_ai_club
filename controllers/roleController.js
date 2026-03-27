import * as RoleModel from '../models/roleModel.js';

// ✅ 1. CREATE A NEW ROLE (Superadmin only)
export const createRole = async (req, res) => {
    try {
        const { role_name, description } = req.body;
        if (!role_name) return res.status(400).json({ message: 'Role name is required' });

        const newRole = await RoleModel.createRole({ role_name, description });
        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating role' });
    }
};

// ✅ 2. GET ALL ROLES
export const getAllRoles = async (req, res) => {
    try {
        const roles = await RoleModel.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles' });
    }
};

// ✅ 3. GET ALL PERMISSIONS (Master List)
export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await RoleModel.getAllPermissions();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions' });
    }
};

// ✅ 4. ASSIGN PERMISSION TO A ROLE
export const assignPermissionToRole = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;
        if (!role_id || !permission_id) {
            return res.status(400).json({ message: 'role_id and permission_id are required' });
        }

        const assignment = await RoleModel.assignPermissionToRole(role_id, permission_id);
        res.status(200).json({ message: 'Permission assigned to role successfully', data: assignment });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning permission' });
    }
};

// ✅ 5. ASSIGN ROLE TO A USER
export const assignRoleToUser = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;
        if (!user_id || !role_id) {
            return res.status(400).json({ message: 'user_id and role_id are required' });
        }

        const assignment = await RoleModel.assignRoleToUser(user_id, role_id);
        res.status(200).json({ message: 'Role assigned to user successfully', data: assignment });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning role to user' });
    }
};

// ✅ 6. GET FULL RBAC SUMMARY FOR A USER
export const getUserRBAC = async (req, res) => {
    try {
        const { user_id } = req.params;
        const rbacData = await RoleModel.getUserRBAC(user_id);
        
        if (!rbacData) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json(rbacData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user RBAC data' });
    }
};

// ✅ 7. REMOVE ROLE FROM A USER
export const removeRoleFromUser = async (req, res) => {
    try {
        const { user_id, role_id } = req.params; 
        await RoleModel.removeRoleFromUser(user_id, role_id);
        res.status(200).json({ message: 'Role removed from user successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing role' });
    }
};

// ✅ 8. DELETE A ROLE
export const deleteRole = async (req, res) => {
    try {
        const { role_id } = req.params;
        const result = await RoleModel.deleteRole(role_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role' });
    }
};
