import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import rbacRoutes from './rbacRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/rbac', rbacRoutes);

export default router;
