import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import Service from '../models/Service';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user.role !== 'resident') {
    res.status(403);
    throw new Error('Only residents can create bookings');
  }

  const { serviceId, scheduledDate, notes } = req.body;
  const service = await Service.findById(serviceId);
  
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const booking = await Booking.create({
    residentId: authReq.user._id,
    serviceId,
    providerId: service.providerId,
    scheduledDate,
    notes,
    status: 'pending',
  });

  res.status(201).json(booking);
});

export const getResidentBookings = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const residentBookings = await Booking.find({ residentId: authReq.user._id })
    .populate('serviceId')
    .populate('providerId', 'name email');
    
  res.json(residentBookings);
});

export const getProviderBookings = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const providerBookings = await Booking.find({ providerId: authReq.user._id })
    .populate('serviceId')
    .populate('residentId', 'name email');
    
  res.json(providerBookings);
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.providerId.toString() !== authReq.user._id.toString() && booking.residentId.toString() !== authReq.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this booking');
  }

  booking.status = status;
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

export const rateBooking = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { rating } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.residentId.toString() !== authReq.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to rate this booking');
  }

  if (booking.status !== 'completed') {
    res.status(400);
    throw new Error('Can only rate completed bookings');
  }

  if (booking.rating) {
    res.status(400);
    throw new Error('Booking already rated');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  booking.rating = rating;
  await booking.save();

  // Update provider's average rating
  const provider = await User.findById(booking.providerId);
  if (provider) {
    const oldVotes = provider.votes || 0;
    const oldRating = provider.rating || 0;
    
    provider.votes = oldVotes + 1;
    provider.rating = ((oldRating * oldVotes) + rating) / provider.votes;
    await provider.save();
  }

  res.json({ message: 'Rating submitted successfully', booking });
});
