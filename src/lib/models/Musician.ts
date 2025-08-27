import mongoose, { Document, Schema } from 'mongoose';

export interface IMusician extends Document {
  name: string;
  instrument: string;
  createdAt: Date;
  updatedAt: Date;
}

const MusicianSchema = new Schema<IMusician>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    instrument: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

MusicianSchema.index({ name: 1, instrument: 1 }, { unique: true });

export default mongoose.models.Musician || mongoose.model<IMusician>('Musician', MusicianSchema);


