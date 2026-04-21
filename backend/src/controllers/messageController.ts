import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Message from '../models/Message';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMessagesByBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.params;
  
  // Find messages by bookingId and sort by timestamp ascending
  const chatHistory = await Message.find({ bookingId }).sort({ timestamp: 1 });

  res.json(chatHistory);
});
