import express from 'express';
import { getMyProfile, updateMyProfile, getAllUsers, toggleUserStatus, searchUsers } from '../controllers/userController.js';
import { verifyToken, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Self-service routes
router.get('/profile', verifyToken, getMyProfile);
router.put('/profile', verifyToken, updateMyProfile);

// Admin-only routes
router.get('/all', verifyToken, superAdminOnly, getAllUsers);
router.patch('/:id/status', verifyToken, superAdminOnly, toggleUserStatus);
router.get('/search', verifyToken, superAdminOnly, searchUsers);

export default router;
