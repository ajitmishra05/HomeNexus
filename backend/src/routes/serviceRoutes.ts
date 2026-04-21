import express from 'express';
import {
  createService,
  updateService,
  getProviderServices,
  getAvailableServices,
} from '../controllers/serviceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createService).get(protect, getAvailableServices);
router.route('/provider').get(protect, getProviderServices);
router.route('/:id').put(protect, updateService);

export default router;
