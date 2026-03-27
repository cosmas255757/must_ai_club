import express from 'express';
import { getMyProfile, updateMyProfile, getAllUsers, toggleUserStatus } from '../controllers/userController.js';
import { verifyToken, superAdminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Self-service routes
router.get('/profile', verifyToken, getMyProfile);
router.put('/profile', verifyToken, updateMyProfile);

// Admin-only routes
router.get('/all', verifyToken, superAdminOnly, getAllUsers);
router.patch('/:id/status', verifyToken, superAdminOnly, toggleUserStatus);

export default router;
