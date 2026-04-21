import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, role, firebaseUid } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      role: role || 'resident',
      firebaseUid: firebaseUid || email,
    });
  } else if (user.role === 'admin' || user.password) {
    if (!password) {
      res.status(401);
      throw new Error('Password required for this account');
    }
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id.toString()),
  });
});
