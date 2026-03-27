import * as PermissionModel from '../models/permissionModel.js';

// ✅ 1. CREATE OR UPDATE PERMISSION
export const createPermission = async (req, res) => {
    try {
        const { permission_key, description } = req.body;
        if (!permission_key) {
            return res.status(400).json({ message: 'Permission key is required' });
        }

        const newPerm = await PermissionModel.createPermission({ permission_key, description });
        res.status(201).json({ message: 'Permission saved', data: newPerm });
    } catch (error) {
        res.status(500).json({ message: 'Error processing permission' });
    }
};

// ✅ 2. GET ALL PERMISSIONS
export const getAllPermissions = async (req, res) => {
    try {
        const permissions = await PermissionModel.getAllPermissions();
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permissions' });
    }
};

// ✅ 3. FIND PERMISSION BY KEY
export const getPermissionByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const permission = await PermissionModel.findPermissionByKey(key);

        if (!permission) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        res.status(200).json(permission);
    } catch (error) {
        res.status(500).json({ message: 'Error searching permission' });
    }
};

// ✅ 4. UPDATE DESCRIPTION BY ID
export const updatePermissionDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updated = await PermissionModel.updatePermission(id, description);
        if (!updated) {
            return res.status(404).json({ message: 'Permission ID not found' });
        }
        res.status(200).json({ message: 'Update successful', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating description' });
    }
};

// ✅ 5. DELETE PERMISSION
export const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await PermissionModel.deletePermission(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting permission' });
    }
};

// ✅ 6. SEED PERMISSIONS
export const seedSystemPermissions = async (req, res) => {
    try {
        const { permissions } = req.body;
        if (!Array.isArray(permissions)) {
            return res.status(400).json({ message: 'Permissions must be an array' });
        }

        const result = await PermissionModel.seedPermissions(permissions);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error seeding data' });
    }
};
