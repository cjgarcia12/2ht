import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  soundcloudUrl?: string;
  lyrics?: string;
  description?: string;
  imageUrl?: string;
  isOriginal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      trim: true,
    },
    album: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
    },
    spotifyUrl: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    soundcloudUrl: {
      type: String,
      trim: true,
    },
    lyrics: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    isOriginal: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema); 