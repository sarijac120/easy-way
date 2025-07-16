import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRideGroup extends Document {
  groupName: string;
  origin: string;
  destination: string;
  days: string[];
  departureTime: string;
  returnTime?: string;
  capacityTotal: number;
  estimatedDuration: number;
  driverId: Types.ObjectId;
  passengers: Types.ObjectId[];
  isActive: boolean;
  groupImageURL?: string; // <--- הוסף את השורה הזאת
}

const rideGroupSchema = new Schema<IRideGroup>(
  {
    groupName: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    days: [{ type: String, required: true }],
    departureTime: { type: String, required: true },
    returnTime: { type: String },
    capacityTotal: { type: Number, required: true, min: 1, max: 20 },
    estimatedDuration: { type: Number, required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    passengers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    groupImageURL: { type: String, default: null }, // <--- והוסף את השורה הזאת
  },
  { timestamps: true }
);

export const RideGroup = mongoose.model<IRideGroup>('RideGroup', rideGroupSchema);