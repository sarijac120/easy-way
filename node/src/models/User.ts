import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

interface JoinedGroup {
  groupId: Types.ObjectId;
  rideDate: Date;
  estimatedDuration: number;
}

export interface IUser extends Document {
  email: string;
  userName: string;
  password: string;
  role: 'PASSENGER' | 'DRIVER' | 'ADMIN';
  avatarUrl?: string;
  joinedGroups: JoinedGroup[];
  isEmailVerified: boolean; // ✅ שדה חדש
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    userName: { type: String, required: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['PASSENGER', 'DRIVER', 'ADMIN'], default: 'PASSENGER' },
    avatarUrl: { type: String, default: '' },
    joinedGroups: [
      {
        groupId: { type: Schema.Types.ObjectId, ref: 'RideGroup', required: true },
        rideDate: { type: Date, required: true },
        estimatedDuration: { type: Number, required: true }
      }
    ],
    isEmailVerified: { type: Boolean, default: false } // ✅ חדש - דיפולט שקר
  },
  { timestamps: true }
);

//Password encryption
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compaire password 
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
