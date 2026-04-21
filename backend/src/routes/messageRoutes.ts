import express from 'express';
import { getMessagesByBooking } from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:bookingId', protect, getMessagesByBooking);

export default router;
