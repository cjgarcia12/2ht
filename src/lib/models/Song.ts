import mongoose, { Document, Schema } from 'mongoose';

export interface IMusician {
  name: string;
  instrument: string;
}

export interface ISong extends Document {
  title: string;
  description?: string;
  releaseDate?: Date;
  musicians?: IMusician[];
  audioUrl?: string;
  videoUrl?: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration?: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
  soundcloudUrl?: string;
  imageUrl?: string;
  isOriginal: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MusicianSchema = new Schema({
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
});

const SongSchema = new Schema<ISong>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    releaseDate: {
      type: Date,
    },
    musicians: [MusicianSchema],
    audioUrl: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
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