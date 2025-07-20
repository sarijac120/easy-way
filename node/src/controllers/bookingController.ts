import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { RideBooking } from '../models/RideBooking';
import { RideGroup } from '../models/RideGroup';
import { User } from '../models/User';
import { DriverAuthRequest } from '../middlewares/isDriverAuth';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    isEmailVerified: boolean;
  };
}


type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED';


export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { rideGroupId, rideDate, seatsRequested, pickupLocation } = req.body;

    // 1. אימות משתמש מחובר
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: { message: 'User not authenticated' } });
    }

    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: { message: 'Invalid user ID' } });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 2. אימות קבוצת נסיעה
    const group = await RideGroup.findById(rideGroupId);
    if (!group || !group.isActive) {
      return res.status(404).json({ error: { message: 'Ride group not found or not active' } });
    }

    // --- שינוי נדרש: בדיקה שהמבקש אינו הנהג ---
    // 3. בדיקה שהמשתמש ששלח את הבקשה הוא לא הנהג של הקבוצה
    if (group.driverId.toString() === userObjectId.toString()) {
      return res.status(400).json({ error: { message: 'Driver cannot book a seat in their own ride' } });
    }
    // ---------------------------------------------

    // 4. בדיקה שהמשתמש לא כבר חבר מאושר בקבוצה
    const isAlreadyApproved = group.passengers.some(p => p.toString() === userObjectId.toString());
    if (isAlreadyApproved) {
      return res.status(400).json({ error: { message: 'The user is already a member of the group.' } });
    }

    // 5. בדיקה שהמשתמש לא שלח כבר בקשה שממתינה לאישור
    const existingPendingBooking = await RideBooking.findOne({
      rideGroupId,
      passengerId: userObjectId,
      status: 'PENDING'
    });

    if (existingPendingBooking) {
      return res.status(400).json({ error: { message: 'You have already sent a request to join this ride.' } });
    }

    // 6. בדיקת התנגשות זמנים עם נסיעות אחרות של המשתמש
    const user = await User.findById(userObjectId).populate({ path: 'joinedGroups.groupId', select: 'rideDate estimatedDuration' });
    if (!user) {
      return res.status(404).json({ error: { message: 'user not found' } });
    }

    const requestedStart = new Date(rideDate).getTime();
    const requestedEnd = requestedStart + (group.estimatedDuration * 60000);

    const hasConflict = user.joinedGroups.some((joined: any) => {
      const joinedGroup = joined.groupId;
      if (!joinedGroup || !joinedGroup.rideDate || !joinedGroup.estimatedDuration) return false;
      const joinedStart = new Date(joinedGroup.rideDate).getTime();
      const joinedEnd = joinedStart + (joinedGroup.estimatedDuration * 60000);
      return Math.max(requestedStart, joinedStart) < Math.min(requestedEnd, joinedEnd);
    });

    if (hasConflict) {
      return res.status(400).json({ error: { message: 'The user is already registered for another trip at the same time.המשתמש כבר רשום לנסיעה אחרת באותו זמן' } });
    }

    // 7. לוגיקת הסטטוס בהתאם למקומות הפנויים
    let status: BookingStatus;

    const pendingBookings = await RideBooking.find({ rideGroupId, status: 'PENDING' });
    const pendingSeats = pendingBookings.reduce((sum, booking) => sum + booking.seatsRequested, 0);
    const totalSeatsTakenOrPending = group.passengers.length + pendingSeats + seatsRequested;

    if (totalSeatsTakenOrPending <= group.capacityTotal) {
      status = 'PENDING';
    } else {
      status = 'REJECTED';
    }
    
    // 8. יצירת רשומת Booking עם הסטטוס המתאים
    const booking = await RideBooking.create({
      rideGroupId,
      rideDate,
      seatsRequested,
      passengerId: userObjectId,
      pickupLocation,
      status
    });

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(500).json({ error: { message: err.message } });
  }
};


export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id; // בהנחה שיש לך middleware שמכניס את המשתמש ל־req
    const statusFilter = req.query.status as string | undefined;

    const filter: any = { passengerId: userId };
    if (statusFilter && ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    const bookings = await RideBooking.find(filter)
      .populate('rideGroupId', 'groupName origin destination') // use groupName for consistency
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ message: 'Failed to fetch ride bookings' });
  }
};


// Controller updated to handle race conditions for approving a booking
export const updateBookingStatus = async (req: DriverAuthRequest, res: Response) => {
  const { status } = req.body;
  // אנו נשתמש ב-booking מהבקשה, אבל את המידע על הקבוצה נטען מחדש בתוך הטרנזקציה
  const { booking } = req;

  // --- שלב 1: ולידציות ראשוניות (ללא שינוי) ---
  if (!booking) {
    return res.status(500).json({ error: 'שגיאה פנימית: מידע על הבקשה חסר.' });
  }

  if (booking.status !== 'PENDING') {
    return res.status(400).json({ error: `לא ניתן לשנות סטטוס של בקשה שכבר טופלה (סטטוס נוכחי: ${booking.status})` });
  }

  if (status !== 'APPROVED' && status !== 'REJECTED') {
    return res.status(400).json({ error: "סטטוס לא חוקי. יש לספק 'APPROVED' או 'REJECTED'" });
  }

  // --- מקרה של דחייה - לא דורש טרנזקציה (ללא שינוי) ---
  if (status === 'REJECTED') {
    try {
      booking.status = 'REJECTED';
      await booking.save();
      return res.status(200).json(booking);
    } catch (error: any) {
      console.error("Error rejecting booking:", error);
      return res.status(500).json({ error: "שגיאה בעדכון סטטוס הדחייה." });
    }
  }

  // --- מקרה של אישור - שימוש בטרנזקציה משופרת ---
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const [group, passenger] = await Promise.all([
      RideGroup.findById(booking.rideGroupId).session(session).orFail(new Error('הקבוצה לא נמצאה')),
      User.findById(booking.passengerId).session(session).orFail(new Error('הנוסע לא נמצא'))
    ]);

    if (group.passengers.length + booking.seatsRequested > group.capacityTotal) {
      // אין צורך לבצע שינויים, פשוט מבטלים את הטרנזקציה ומודיעים למשתמש.
      await session.abortTransaction();
      return res.status(409).json({ error: 'אין מספיק מקומות פנויים בקבוצה לאישור בקשה זו.' }); // 409 Conflict is a good status code here
    }

    // שלב 4: עדכון כל הדוקומנטים הרלוונטיים
    
    // א. עדכון סטטוס הבקשה
    booking.status = 'APPROVED';

    // ב. עדכון רשימת הנוסעים בקבוצה
    group.passengers.push(booking.passengerId);

    // ג. עדכון פרופיל הנוסע עם פרטי ההצטרפות
    passenger.joinedGroups.push({
      groupId: group._id as Types.ObjectId,
      rideDate: booking.rideDate, // המידע הנכון מגיע מהבקשה
      estimatedDuration: group.estimatedDuration,
    });

    // שלב 5: שמירת כל השינויים יחד כחלק מהטרנזקציה
    await Promise.all([
      booking.save({ session }),
      group.save({ session }),
      passenger.save({ session })
    ]);

    // אם כל השמירות הצליחו, ננעל את הטרנזקציה (commit)
    await session.commitTransaction();

    res.status(200).json(booking);

  } catch (error: any) {
    // שלב 6: אם משהו נכשל בכל שלב בבלוק ה-try, בטל את הטרנזקציה
    await session.abortTransaction();
    console.error("Transaction aborted due to an error:", error);
    res.status(500).json({ error: `לא ניתן היה לאשר את הבקשה. הפעולה בוטלה. סיבה: ${error.message}` });
  } finally {
    // שלב 7: תמיד סגור את הסשן כדי לשחרר משאבים
    session.endSession();
  }
};


export const  getDriverPendingBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: { message: 'משתמש לא מחובר' } });
    }

    const driverId = req.user._id;

    // 1. מצא את כל הקבוצות שהמשתמש הנוכחי הוא הנהג שלהן
    const driverGroups = await RideGroup.find({ driverId }).select('_id');

    // 2. חלץ את המזהים של הקבוצות למערך
    const driverGroupIds = driverGroups.map(group => group._id);

    // אם לנהג אין קבוצות, החזר מערך ריק
    if (driverGroupIds.length === 0) {
      return res.status(200).json([]);
    }

    // 3. מצא את כל הבקשות הממתינות המשויכות לקבוצות אלו
    // נשתמש ב-populate כדי להציג לנהג מידע מלא על הנוסע ועל הקבוצה
    const pendingBookings = await RideBooking.find({
      rideGroupId: { $in: driverGroupIds },
      status: 'PENDING'
    })
    .populate({
      path: 'passengerId',
      select: 'userName' // בחר את השדות שתרצה להציג, הימנע ממידע רגיש
    })
    .populate({
      path: 'rideGroupId',
      select: 'groupName' // פרטים רלוונטיים על הקבוצה
    })
    .sort({ createdAt: -1 }); // מיין מהבקשה החדשה ביותר לישנה

    res.status(200).json(pendingBookings);

  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
};



export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id;

    // --- הוספת בדיקה חשובה ---
    if (!userId) {
      return res.status(401).json({ error: { message: 'User not authenticated' } });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: { message: 'Invalid booking ID' } });
    }

    const booking = await RideBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: { message: 'Booking not found' } });
    }

    // --- כאן התיקון העיקרי ---
    // המר את שני המזהים לטקסט לפני ההשוואה
    if (booking.passengerId.toString() !== userId.toString()) {
      return res.status(403).json({ error: { message: 'You are not authorized to cancel this booking' } });
    }
    
    // החלופה המומלצת יותר היא להשתמש ב-equals:
    // if (!booking.passengerId.equals(userId)) { ... }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: { message: 'Only pending requests can be cancelled' } });
    }

    booking.status = 'CANCELLED';
    await booking.save();
    
    res.status(200).json(booking);
  } catch (err: any) {
    console.error("Error in cancelBooking:", err); // מומלץ להוסיף לוג לשגיאות
    res.status(500).json({ error: { message: 'An internal server error occurred' } });
  }
};