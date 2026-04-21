import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message';

dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('joinRoom', (bookingId) => {
    socket.join(bookingId);
    console.log(`Socket ${socket.id} joined room: ${bookingId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      // data: { bookingId, senderId, receiverId, messageText }
      const newMessage = await Message.create({
        bookingId: data.bookingId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        messageText: data.messageText,
      });
      
      // Broadcast to the room
      io.to(data.bookingId).emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Routes
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import User from './models/User';
import bcrypt from 'bcryptjs';

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('HomeNexus API is running...');
});

app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Seed Master Admin
  try {
    const adminEmail = 'ajitmishra05@admin.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('mishraajit05', 10);
      await User.create({
        name: 'Master Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        firebaseUid: 'admin_master_123',
      });
      console.log('Master Admin seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding Master Admin:', error);
  }

  // IMPORTANT: Use server.listen, not app.listen!
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
