import express from 'express';
import { updateUserProfile, deleteUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/profile')
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserProfile);

export default router;
