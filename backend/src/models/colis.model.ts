import mongoose, { Schema, Document } from "mongoose";

export interface IColis extends Document {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  fromCity: string;
  toCity: string;
  weight: number;
  price: number;
  quantity: number;
  orderInCommand: number;
  ncommand: string; // e.g. "1/2", "2/2"
  isPaid: boolean;
  isADomicile: boolean;
  status: 'pending' | 'in_transit' | 'delivered';
  date?: string;
  description?: string;
  image?: string;
  direction?: 'FR_TO_MA' | 'MA_TO_FR';
  createdAt: Date;
  updatedAt: Date;
}

const ColisSchema = new Schema<IColis>(
  {
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    senderPhone: {
      type: String,
      required: [true, "Sender phone is required"],
      trim: true,
    },
    receiverName: {
      type: String,
      required: [true, "Receiver name is required"],
      trim: true,
    },
    receiverPhone: {
      type: String,
      required: [true, "Receiver phone is required"],
      trim: true,
    },
    fromCity: {
      type: String,
      required: [true, "Departure city is required"],
      trim: true,
    },
    toCity: {
      type: String,
      required: [true, "Destination city is required"],
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0, "Weight must be positive"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },
    orderInCommand: {
      type: Number,
      default: 1,
      min: [1, "Order in command must be at least 1"],
    },
    ncommand: {
      type: String,
      required: [true, "ncommand is required"],
      trim: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    isADomicile: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'delivered'],
      default: 'pending',
    },
    date: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      trim: true,
    },
    direction: {
      type: String,
      enum: ['FR_TO_MA', 'MA_TO_FR'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Colis = mongoose.model<IColis>("Colis", ColisSchema);

export default Colis;
export { Colis };

