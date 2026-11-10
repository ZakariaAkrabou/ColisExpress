import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  phone: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Client = mongoose.model<IClient>("Client", ClientSchema);

export default Client;
export { Client };
