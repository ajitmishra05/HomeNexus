import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Service from '../models/Service';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.password) {
      user.password = req.body.password; // In a real app, hash this
    }

    const updatedUser = await user.save();

    // If provider, update their service if category or price is provided
    if (user.role === 'serviceProvider' && (req.body.serviceCategory || req.body.servicePrice)) {
      const service = await Service.findOne({ providerId: user._id });
      if (service) {
        if (req.body.serviceCategory) service.category = req.body.serviceCategory;
        if (req.body.servicePrice) service.price = req.body.servicePrice;
        await service.save();
      }
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user profile
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Also delete associated services and bookings
    if (user.role === 'serviceProvider') {
      await Service.deleteMany({ providerId: user._id });
      await Booking.deleteMany({ providerId: user._id });
    } else {
      await Booking.deleteMany({ residentId: user._id });
    }
    
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
