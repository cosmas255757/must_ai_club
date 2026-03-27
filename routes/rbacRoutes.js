import express from 'express';
import * as RoleCtrl from '../controllers/roleController.js';
import * as PermCtrl from '../controllers/permissionController.js';
import { verifyToken, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require Superadmin status
router.use(verifyToken, superAdminOnly);

// Roles
router.get('/roles', RoleCtrl.getAllRoles);
router.post('/roles', RoleCtrl.createRole);
router.delete('/roles/:role_id', RoleCtrl.deleteRole);

// Permissions
router.get('/permissions', PermCtrl.getAllPermissions);
router.post('/permissions', PermCtrl.createPermission);
router.post('/permissions/seed', PermCtrl.seedSystemPermissions);
router.put('/permissions/:id', PermCtrl.updatePermissionDescription);

// Assignments
router.post('/assign-role', RoleCtrl.assignRoleToUser);
router.post('/assign-permission', RoleCtrl.assignPermissionToRole);
router.delete('/user-role/:user_id/:role_id', RoleCtrl.removeRoleFromUser);

export default router;
