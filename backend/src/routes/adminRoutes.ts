import express from 'express';
import { getAllUsers, deleteUser, getSystemHealth } from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/system-health').get(protect, admin, getSystemHealth);

export default router;
