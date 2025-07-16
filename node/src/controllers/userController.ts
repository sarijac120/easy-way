import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { Types } from 'mongoose';
import { RideGroup } from '../models/RideGroup';
import bcrypt from 'bcrypt'

import { createEmailToken } from '../utils/emailToken';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { verifyEmailToken } from '../utils/emailToken';


interface AuthRequest extends Request {
  user?: {
    _id: string;
    [key: string]: any;
  };
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, userName, password } = req.body;
    let role = (req.body.role?.toUpperCase() || 'PASSENGER') as 'PASSENGER' | 'DRIVER' | 'ADMIN';

    if (!['PASSENGER', 'DRIVER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: { message: 'Invalid role' } });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: { message: 'Email already in use' } });
    }

    const user = await User.create({ email, userName, password, role });
    const token = signToken(user._id as Types.ObjectId, user.role);
    const userString :string = user._id as string;
    // שליחת מייל אימות
    const emailToken = createEmailToken(userString);
    await sendVerificationEmail(user.email, emailToken);

    return res.status(201).json({ token, user, message: 'Check your email to verify your account' });
  } catch (err: any) {
    return res.status(400).json({ error: { message: err.message } });
  }
};



export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const payload = verifyEmailToken(token);
    const user = await User.findByIdAndUpdate(payload.id, { isEmailVerified: true });

    if (!user) return res.status(404).send('User not found');
    return res.send('<h1>Email verified successfully</h1>');
  } catch (err) {
    return res.status(400).send('Invalid or expired token');
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: { message: 'User not found' } });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'Invalid password' } });
    }

    const token = signToken(user._id as Types.ObjectId, user.role);
    user.password = undefined as unknown as string;

    return res.status(200).json({ token, user });
  } catch (err: any) {
    return res.status(400).json({ error: { message: err.message } });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    // Fetch all relevant fields, including userName
    const user = await User.findById(req.user?._id).select('userName email avatarUrl role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id; 
    const { userName, email } = req.body;

    const updates: any = {};
    if (userName) updates.userName = userName;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('userName email');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = req.user?._id;

    const groups = await RideGroup.find({ driverId })
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
};


export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id)
      .populate({
        path: 'joinedGroups.groupId',
        select: 'groupName origin destination days departureTime'
      });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.joinedGroups);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId).select('+password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
};

// // Get groups the user joined as a passenger (not as driver)
// export const getJoinedGroups = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user?._id;
//     // Find all groups where user is a passenger but not the driver
//     const groups = await RideGroup.find({
//       passengers: userId,
//       driverId: { $ne: userId },
//       isActive: true
//     }).populate({
//       path: 'driverId',
//       select: 'userName'
//     });
//     // Add driverName for convenience
//     const groupsWithDriverName = groups.map((group: any) => {
//       const groupObj = group.toObject();
//       return {
//         ...groupObj,
//         driverName: groupObj.driverId?.userName || '',
//       };
//     });
//     res.json(groupsWithDriverName);
//   } catch (err: any) {
//     res.status(500).json({ error: { message: err.message } });
//   }
// };

export const getMyJoinedGroups = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. קבל את מזהה המשתמש מה-token (שנוסף על ידי middleware האימות)
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 2. מצא את המשתמש לפי ה-ID שלו ובצע 'populate' על שדה הקבוצות
    // populate('joinedGroups.groupId') נכנס לתוך המערך 'joinedGroups'
    // ולכל אובייקט במערך, הוא ממלא את השדה 'groupId' במידע המלא ממודל RideGroup
    const userWithGroups = await User.findById(userId)
      .populate({
        path: 'joinedGroups.groupId', // הנתיב לשדה שרוצים למלא
        model: 'RideGroup'           // שם המודל שממנו נלקח המידע
      })
      .select('joinedGroups'); // בחר רק את השדה הרלוונטי כדי שהתגובה תהיה נקייה

    // 3. בדוק אם המשתמש נמצא
    if (!userWithGroups) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. שלח את מערך הקבוצות המלא בתגובה
    res.status(200).json({
      status: 'success',
      results: userWithGroups.joinedGroups.length,
      data: {
        joinedGroups: userWithGroups.joinedGroups
      }
    });

  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};