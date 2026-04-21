import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Service from '../models/Service';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const createService = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'serviceProvider') {
    res.status(403);
    throw new Error('Only service providers can create services');
  }

  const { category, description, price } = req.body;
  const service = await Service.create({
    providerId: req.user._id,
    category,
    description,
    price,
    isAvailable: true,
  });

  res.status(201).json(service);
});

export const updateService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  if (service.providerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this service');
  }

  service.description = req.body.description || service.description;
  service.price = req.body.price || service.price;
  if (req.body.category) service.category = req.body.category;
  if (req.body.isAvailable !== undefined) service.isAvailable = req.body.isAvailable;

  const updatedService = await service.save();
  res.json(updatedService);
});

export const deleteService = asyncHandler(async (req: AuthRequest, res: Response) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this service');
  }

  await service.deleteOne();
  res.json({ message: 'Service removed successfully' });
});

export const getProviderServices = asyncHandler(async (req: AuthRequest, res: Response) => {
  const providerServices = await Service.find({ providerId: req.user._id });
  res.json(providerServices);
});

export const getAvailableServices = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  const query: any = { isAvailable: true };
  if (category) query.category = category;
  
  const availableServices = await Service.find(query).populate('providerId', 'name email votes rating');

  // Calculate Global Average Rating C
  const providers = await User.find({ role: 'serviceProvider', votes: { $gt: 0 } });
  let totalRatingSum = 0;
  let totalProvidersWithVotes = 0;
  
  providers.forEach(p => {
    totalRatingSum += p.rating || 0;
    totalProvidersWithVotes++;
  });
  
  const C = totalProvidersWithVotes > 0 ? totalRatingSum / totalProvidersWithVotes : 0;
  const m = 50;

  // Calculate Priority Score for each service
  const servicesWithScore = availableServices.map(service => {
    const provider = service.providerId as any;
    const v = provider.votes || 0;
    const R = provider.rating || 0;
    
    let priorityScore = 0;
    if (v === 0 && C === 0) {
       priorityScore = 0;
    } else {
       priorityScore = (v / (v + m)) * R + (m / (v + m)) * C;
    }

    return {
      ...service.toObject(),
      priorityScore
    };
  });

  // Sort descending by priorityScore
  servicesWithScore.sort((a, b) => b.priorityScore - a.priorityScore);

  res.json(servicesWithScore);
});
