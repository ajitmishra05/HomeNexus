import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  residentId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  scheduledDate: Date;
  notes?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    residentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    scheduledDate: { type: Date, required: true },
    notes: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
