import * as PermissionModel from '../models/permissionModel.js';

// ✅ 1. CREATE PERMISSION (Master Action list)
export const createPermission = async (req, res) => {
    try {
        const { permission_key, description } = req.body;

        if (!permission_key) {
            return res.status(400).json({ message: 'Permission key is required (e.g., USER_DELETE)' });
        }

        const newPermission = await PermissionModel.createPermission({ permission_key, description });
        
        res.status(201).json({ 
            message: 'Permission created/updated successfully', 
            permission: newPermission 
        });
    } catch (error) {
        console.error('Create Permission Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ✅ 2. GET ALL PERMISSIONS
export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await PermissionModel.getAllPermissions();
        res.status(200).json(permissions);
    } catch (error) {
        console.error('Get Permissions Error:', error.message);
        res.status(500).json({ message: 'Error fetching permissions' });
    }
};

// ✅ 3. FIND PERMISSION BY KEY
export const getPermissionByKey = async (req, res) => {
    try {
        const { key } = req.params; // Expecting /api/permissions/:key
        const permission = await PermissionModel.findPermissionByKey(key);

        if (!permission || permission.length === 0) {
            return res.status(404).json({ message: 'Permission not found' });
        }

        res.status(200).json(permission);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permission' });
    }
};

// ✅ 4. UPDATE PERMISSION DESCRIPTION
export const updatePermissionDescription = async (req, res) => {
    try {
        const { id } = req.params; // Expecting /api/permissions/:id
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ message: 'Description is required for update' });
        }

        const updated = await PermissionModel.updatePermission(id, description);

        if (!updated || updated.length === 0) {
            return res.status(404).json({ message: 'Permission ID not found' });
        }

        res.status(200).json({ message: 'Permission updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating permission' });
    }
};

// ✅ 5. DELETE PERMISSION
export const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await PermissionModel.deletePermission(id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Delete Permission Error:', error.message);
        res.status(500).json({ message: 'Error deleting permission' });
    }
};

// ✅ 6. SEED SYSTEM PERMISSIONS (Bulk Setup)
export const seedSystemPermissions = async (req, res) => {
    try {
        const { permissions } = req.body; // Expecting array of {key, description}
        
        if (!Array.isArray(permissions)) {
            return res.status(400).json({ message: 'Permissions must be an array' });
        }

        const result = await PermissionModel.seedPermissions(permissions);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error seeding permissions' });
    }
};
