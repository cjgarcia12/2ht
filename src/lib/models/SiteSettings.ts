import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  // Homepage content
  heroTitle: string;
  heroDescription: string;
  aboutSectionText: string;
  
  // About page content
  aboutPageContent: string;
  
  // Contact information
  contactEmail?: string;
  contactPhone?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroTitle: {
      type: String,
      required: true,
      default: '2HTSounds',
    },
    heroDescription: {
      type: String,
      required: true,
      default: 'Experience the power of live music with our unique sound and energy',
    },
    aboutSectionText: {
      type: String,
      required: true,
      default: '2HTSounds brings together years of musical experience and passion to create unforgettable live performances. Our diverse repertoire spans multiple genres, ensuring there\'s something for everyone at our shows.',
    },
    aboutPageContent: {
      type: String,
      required: true,
      default: 'Welcome to 2HTSounds! We are a passionate band dedicated to bringing you the best live music experience.',
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);