import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  phone?: string;
  eventDate: Date;
  eventType: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  expectedAttendance?: number;
  budget?: string;
  message: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['wedding', 'corporate', 'festival', 'private-party', 'bar-gig', 'other'],
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    expectedAttendance: {
      type: Number,
    },
    budget: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema); 