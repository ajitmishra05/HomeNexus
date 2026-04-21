import express from 'express';
import {
  createBooking,
  getResidentBookings,
  getProviderBookings,
  updateBookingStatus,
  rateBooking,
} from '../controllers/bookingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/resident').get(protect, getResidentBookings);
router.route('/provider').get(protect, getProviderBookings);
router.route('/:id/status').patch(protect, updateBookingStatus);
router.route('/:id/rate').post(protect, rateBooking);

export default router;
