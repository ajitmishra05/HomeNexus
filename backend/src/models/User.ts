import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  password?: string;
  name: string;
  role: 'resident' | 'serviceProvider' | 'admin';
  address?: string;
  phone?: string;
  votes: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    role: { type: String, enum: ['resident', 'serviceProvider', 'admin'], required: true },
    address: { type: String },
    phone: { type: String },
    votes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
