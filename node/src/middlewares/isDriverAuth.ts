import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { AuthRequest } from './authMiddleware';
import { RideBooking } from '../models/RideBooking';
import { RideGroup } from '../models/RideGroup';

export interface DriverAuthRequest extends AuthRequest {
  booking?: any; 
  group?: any;  
}

/**
 * check if the user is this group driver
 */
export const isGroupDriver = async (req: DriverAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: { message: 'ride group id is inavalid' } });
    }

    const booking = await RideBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: { message: 'Booking request not found' } });
    }

    const group = await RideGroup.findById(booking.rideGroupId);
    if (!group) {
      return res.status(404).json({ error: { message: 'This ride group not found'} });
    }

    if (group.driverId.toString() !== userId?.toString()) {
      return res.status(403).json({ error: { message: 'You do not have permission to perform this action. Only the group driver can perform it.' } });
    }

    req.booking = booking;
    req.group = group;

    next(); // המשך לפונקציית הקונטרולר הבאה
 } catch (error: any) {
    console.error('ERROR IN isGroupDriver MIDDLEWARE:', error); // הוסף את השורה הזו
    res.status(500).json({ error: { message: 'Internal Server Error in Middleware', details: error.message } });
}
};



export const verifyGroupOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const driverId = req.user!._id;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            // נחזיר הודעה עקבית עם שאר המערכת
             return res.status(400).json({ error: 'מזהה קבוצה לא תקין.' });
        }

        const group = await RideGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ error: 'הקבוצה לא נמצאה.' });
        }

        if (!group.driverId.equals(driverId)) {
            return res.status(403).json({ error: 'אינך מורשה לבצע פעולה זו, רק נהג הקבוצה יכול.' });
        }
        
        // אם הכל תקין, המשך לבקר הבא (closeGroup)
        next();
    } catch (error) {
        console.error("ERROR in verifyGroupOwnership middleware:", error);
        res.status(500).json({ error: 'שגיאה באימות בעלות על הקבוצה.' });
    }
};