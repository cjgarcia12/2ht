import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  ticketUrl?: string;
  price?: string;
  imageUrl?: string;
  isPublic: boolean;
  bookingId?: string; // Reference to the booking that created this event
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    ticketUrl: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    bookingId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); 