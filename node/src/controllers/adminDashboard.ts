import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { RideGroup } from '../models/RideGroup';
import { RideBooking } from '../models/RideBooking';

/**
 * @desc    קבלת כל המשתמשים במערכת
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // .find({}) ימצא את כל המשתמשים.
    // שדה הסיסמה לא יישלח חזרה בזכות `select: false` בסכמה.
    const users = await User.find({});
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error); // העברת השגיאה ל-middleware הטיפול בשגיאות
  }
};

/**
 * @desc    קבלת כל קבוצות הנסיעה במערכת
 * @route   GET /api/admin/groups
 * @access  Private (Admin)
 */
export const getAllRideGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // נשתמש ב-populate כדי לקבל פרטים על הנהג במקום רק את ה-ID שלו
    const groups = await RideGroup.find({}).populate('driverId', 'userName email');
    
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    קבלת כל בקשות ההצטרפות (Bookings)
 * @route   GET /api/admin/bookings
 * @access  Private (Admin)
 */
export const getAllRideBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // נשתמש ב-populate כדי להציג מידע על הנוסע ועל הקבוצה במקום רק ID-ים
    const bookings = await RideBooking.find({})
      .populate('passengerId', 'userName email')
      .populate('rideGroupId', 'groupName origin destination');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};