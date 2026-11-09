import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  cityName: string;      
  countryCode: string;  
  countryName: string;   
  agencyName?: string;   
  type: string;          
  isActive: boolean;
  createdAt: Date;
}

const LocationSchema: Schema = new Schema(
  {
    cityName: { type: String, required: true, trim: true },
    countryCode: { type: String, required: true, uppercase: true, trim: true }, 
    countryName: { type: String, required: true, trim: true },
    agencyName: { type: String, trim: true },
    type: { 
      type: String, 
      required: true, 
      default: 'Agence / Point relais' 
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

LocationSchema.index({ cityName: 1, countryCode: 1, agencyName: 1 }, { unique: true });

export const Location = mongoose.model<ILocation>('Location', LocationSchema);