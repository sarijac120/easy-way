import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRideBooking extends Document {
  requestDate: Date;
  rideDate: Date;
  passengerId: Types.ObjectId;
  rideGroupId: Types.ObjectId;
  seatsRequested: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  pickupLocation?: string;
  price?: number;
}

const rideBookingSchema = new Schema<IRideBooking>(
  {
    requestDate: { type: Date, default: Date.now },
    rideDate: { type: Date, required: true },
    passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rideGroupId: { type: Schema.Types.ObjectId, ref: 'RideGroup', required: true },
    seatsRequested: { type: Number, required: true, min: 1, max: 4 },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      required: true
    },
    pickupLocation: { type: String },
    price: { type: Number },
  },
  { timestamps: true }
);

export const RideBooking = mongoose.model<IRideBooking>('RideBooking', rideBookingSchema);
