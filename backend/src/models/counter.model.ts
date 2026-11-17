import mongoose, { Schema } from "mongoose";

export interface ICounter {
  _id: string; // counter name, e.g. "colis_order"
  seq: number;
}

const CounterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

export const Counter = mongoose.model<ICounter>("Counter", CounterSchema);
export default Counter;
