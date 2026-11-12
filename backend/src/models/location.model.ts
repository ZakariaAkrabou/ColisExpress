import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;           
  country: 'Maroc' | 'France'; 
  isActive: boolean;
  createdAt: Date;
}

const LocationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { 
      type: String, 
      required: true, 
      enum: ['Maroc', 'France'] 
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);


LocationSchema.index({ name: 1, country: 1 }, { unique: true });

export const Location = mongoose.model<ILocation>('Location', LocationSchema);