import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  providerId: mongoose.Types.ObjectId;
  category: 'plumber' | 'electrician' | 'laundry' | 'milk_delivery' | 'house_cleaning';
  description: string;
  price: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['plumber', 'electrician', 'laundry', 'milk_delivery', 'house_cleaning'],
      required: true,
    },
    description: { type: String },
    price: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', serviceSchema);
