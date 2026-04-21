import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  bookingId: string;
  senderId: string;
  receiverId: string;
  messageText: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    bookingId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    messageText: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', messageSchema);
