import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Service from '../models/Service';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete an admin user');
    }
    
    if (user.role === 'serviceProvider') {
      await Service.deleteMany({ providerId: user._id });
      await Booking.deleteMany({ providerId: user._id });
    } else {
      await Booking.deleteMany({ residentId: user._id });
    }
    
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get System Health (Global Average Rating C)
// @route   GET /api/admin/system-health
// @access  Private/Admin
export const getSystemHealth = asyncHandler(async (req: Request, res: Response) => {
  const providers = await User.find({ role: 'serviceProvider', votes: { $gt: 0 } });
  let totalRatingSum = 0;
  let totalProvidersWithVotes = 0;
  
  providers.forEach(p => {
    totalRatingSum += p.rating || 0;
    totalProvidersWithVotes++;
  });
  
  const globalAverage = totalProvidersWithVotes > 0 ? totalRatingSum / totalProvidersWithVotes : 0;
  
  res.json({
    globalAverageRating: globalAverage,
    providersWithVotes: totalProvidersWithVotes,
    totalRegisteredUsers: await User.countDocuments()
  });
});
