// import { Request, Response } from 'express';
// import { RideGroup } from '../models/RideGroup';
// import { User } from '../models/User';

// interface AuthenticatedRequest extends Request {
//   user?: {
//     _id?: string;
//     role?: string;
//     isEmailVerified?: boolean; // Add this property to check email verification
//   }
// }

// export const createRideGroup = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ error: { message: 'Unauthorized: User must be logged in' } });
//     }
//     if (!req.user?.isEmailVerified) {
//       return res.status(403).json({ message: 'Email not verified. Please verify your email before creating a group.' });
//     }

//     const {
//       groupName,
//       origin,
//       destination,
//       days,
//       departureTime,
//       returnTime,
//       capacityTotal,
//       estimatedDuration
//     } = req.body;

//     if (!groupName || !origin || !destination || !days || !departureTime || !capacityTotal || !estimatedDuration) {
//       return res.status(400).json({ error: { message: 'Missing required fields' } });
//     }

//     if (!Array.isArray(days) || days.length === 0) {
//       return res.status(400).json({ error: { message: 'Days must be a non-empty array' } });
//     }

//     if (typeof capacityTotal !== 'number' || capacityTotal < 1 || capacityTotal > 20) {
//       return res.status(400).json({ error: { message: 'capacityTotal must be a number between 1 and 20' } });
//     }

//     if (typeof estimatedDuration !== 'number' || estimatedDuration <= 0 || estimatedDuration > 300) {
//       return res.status(400).json({ error: { message: 'estimatedDuration must be a number between 1 and 300 (minutes)' } });
//     }

//     const group = await RideGroup.create({
//       groupName,
//       origin,
//       destination,
//       days,
//       departureTime,
//       returnTime,
//       capacityTotal,
//       estimatedDuration,
//       driverId: req.user._id,
//       passengers: [],
//       isActive: true
//     });

//     await User.findByIdAndUpdate(req.user._id, { role: 'DRIVER' });

//     res.status(201).json(group);
//   } catch (err: any) {
//     res.status(400).json({ error: { message: err.message } });
//   }
// };


// export const getRideGroups = async (_req: Request, res: Response) => {
//   try {
//     const groups = await RideGroup.find({ isActive: true });
//     res.json(groups);
//   } catch (err: any) {
//     res.status(500).json({ error: { message: 'Failed to fetch ride groups' } }); 
//   }
// };





import { Request, Response } from 'express';
import { RideGroup } from '../models/RideGroup';
import { User } from '../models/User';
// import Multer from "multer"
interface AuthenticatedRequest extends Request {
  user?: {
    _id?: string;
    role?: string;
    isEmailVerified?: boolean;
  }
  // multer מוסיף את השדה הזה, אם קיים קובץ
  file?: Express.Multer.File; 
}

// // --- פונקציה מעודכנת ---
// export const createRideGroup = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     // שלב 1: אימות משתמש (ללא שינוי)
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ error: { message: 'Unauthorized: User must be logged in' } });
//     }
//     if (!req.user?.isEmailVerified) {
//       return res.status(403).json({ message: 'Email not verified. Please verify your email before creating a group.' });
//     }

//     // שלב 2: חילוץ נתונים מ-req.body והמרה שלהם
//     const {
//       groupName,
//       origin,
//       destination,
//       departureTime,
//       returnTime,
//     } = req.body;

//     // FormData שולח הכל כסטרינג, אז אנחנו צריכים להמיר חזרה לסוג הנכון
//     const days = req.body.days ? JSON.parse(req.body.days) : [];
//     const capacityTotal = req.body.capacityTotal ? parseInt(req.body.capacityTotal, 10) : null;
//     const estimatedDuration = req.body.estimatedDuration ? parseInt(req.body.estimatedDuration, 10) : null;

//     // שלב 3: יצירת קישור לתמונה (אם הועלתה)
//     let groupImageURL = null;
//     if (req.file) {
//       // req.file נוצר על ידי multer. אנחנו בונים ממנו את ה-URL המלא
//       groupImageURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//     }

//     // שלב 4: ולידציה על הנתונים המומרים
//     if (!groupName || !origin || !destination || !days || !departureTime || !capacityTotal || !estimatedDuration) {
//       return res.status(400).json({ error: { message: 'Missing required fields' } });
//     }
//     if (!Array.isArray(days) || days.length === 0) {
//       return res.status(400).json({ error: { message: 'Days must be a non-empty array' } });
//     }
//     if (isNaN(capacityTotal) || capacityTotal < 1 || capacityTotal > 20) {
//       return res.status(400).json({ error: { message: 'capacityTotal must be a number between 1 and 20' } });
//     }
//     if (isNaN(estimatedDuration) || estimatedDuration <= 0 || estimatedDuration > 300) {
//       return res.status(400).json({ error: { message: 'estimatedDuration must be a number between 1 and 300 (minutes)' } });
//     }

//     // שלב 5: יצירת הקבוצה במסד הנתונים עם הנתונים החדשים
//     const group = await RideGroup.create({
//       groupName,
//       origin,
//       destination,
//       days,
//       departureTime,
//       returnTime,
//       capacityTotal,
//       estimatedDuration,
//       driverId: req.user._id,
//       passengers: [],
//       isActive: true,
//       groupImageURL,
//     });

//     // עדכון תפקיד הנהג (ללא שינוי)
//     await User.findByIdAndUpdate(req.user._id, { role: 'DRIVER' });

//     res.status(201).json(group);
//   } catch (err: any) {
//     // ה-catch יתפוס גם שגיאות המרה (למשל אם days אינו JSON תקין)
//     res.status(400).json({ error: { message: err.message } });
//   }
// };


const timeToMinutes = (timeStr: string | null | undefined): number | null => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};


export const createRideGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // שלב 1: אימות משתמש (ללא שינוי)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: { message: 'Unauthorized: User must be logged in' } });
    }
    if (!req.user?.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email before creating a group.' });
    }

    const driverId = req.user._id;

    // שלב 2: חילוץ והמרת נתונים (ללא שינוי)
    const { groupName, origin, destination, departureTime, returnTime } = req.body;
    const days = req.body.days ? JSON.parse(req.body.days) : [];
    const capacityTotal = req.body.capacityTotal ? parseInt(req.body.capacityTotal, 10) : null;
    const estimatedDuration = req.body.estimatedDuration ? parseInt(req.body.estimatedDuration, 10) : null;

    // שלב 3: יצירת קישור לתמונה (ללא שינוי)
    let groupImageURL = null;
    if (req.file) {
      groupImageURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // שלב 4: ולידציה על הנתונים המומרים (ללא שינוי)
    if (!groupName || !origin || !destination || !days || !departureTime || !capacityTotal || !estimatedDuration) {
      return res.status(400).json({ error: { message: 'Missing required fields' } });
    }
    if (!Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ error: { message: 'Days must be a non-empty array' } });
    }
    if (isNaN(capacityTotal) || capacityTotal < 1 || capacityTotal > 20) {
      return res.status(400).json({ error: { message: 'capacityTotal must be a number between 1 and 20' } });
    }
    if (isNaN(estimatedDuration) || estimatedDuration <= 0 || estimatedDuration > 300) {
      return res.status(400).json({ error: { message: 'estimatedDuration must be a number between 1 and 300 (minutes)' } });
    }

    // --- שינוי נדרש: שלב 5 - בדיקת התנגשות עם קבוצות קיימות ---
    
    // שליפת כל הקבוצות הפעילות של הנהג
    const existingGroups = await RideGroup.find({ driverId, isActive: true });

    // חישוב חלונות הזמן של הקבוצה החדשה
    const newDepartureStart = timeToMinutes(departureTime);
    const newDepartureEnd = newDepartureStart !== null ? newDepartureStart + estimatedDuration : null;
    const newReturnStart = timeToMinutes(returnTime);
    const newReturnEnd = newReturnStart !== null ? newReturnStart + estimatedDuration : null;

    for (const existingGroup of existingGroups) {
      // 5.1: בדיקה אם יש חפיפה בימים
      const hasDayOverlap = days.some((day: string) => existingGroup.days.includes(day));

      if (hasDayOverlap) {
        // 5.2: אם יש חפיפה בימים, נבדוק חפיפה בזמנים
        const existingDepartureStart = timeToMinutes(existingGroup.departureTime);
        const existingDepartureEnd = existingDepartureStart !== null ? existingDepartureStart + existingGroup.estimatedDuration : null;
        const existingReturnStart = timeToMinutes(existingGroup.returnTime);
        const existingReturnEnd = existingReturnStart !== null ? existingReturnStart + existingGroup.estimatedDuration : null;
        
        let timeConflict = false;

        // נוסחה לבדיקת חפיפה בין שני טווחי זמן [start1, end1] ו-[start2, end2]:
        // Math.max(start1, start2) < Math.min(end1, end2)

        // בדיקת חפיפה בין נסיעות ההלוך
        if (newDepartureStart !== null && existingDepartureStart !== null) {
            if (Math.max(newDepartureStart, existingDepartureStart) < Math.min(newDepartureEnd!, existingDepartureEnd!)) {
                timeConflict = true;
            }
        }
        // בדיקת חפיפה בין הלוך חדש לחזור קיים
        if (!timeConflict && newDepartureStart !== null && existingReturnStart !== null) {
            if (Math.max(newDepartureStart, existingReturnStart) < Math.min(newDepartureEnd!, existingReturnEnd!)) {
                timeConflict = true;
            }
        }
        // בדיקת חפיפה בין חזור חדש להלוך קיים
        if (!timeConflict && newReturnStart !== null && existingDepartureStart !== null) {
            if (Math.max(newReturnStart, existingDepartureStart) < Math.min(newReturnEnd!, existingDepartureEnd!)) {
                timeConflict = true;
            }
        }
        // בדיקת חפיפה בין נסיעות החזור
        if (!timeConflict && newReturnStart !== null && existingReturnStart !== null) {
            if (Math.max(newReturnStart, existingReturnStart) < Math.min(newReturnEnd!, existingReturnEnd!)) {
                timeConflict = true;
            }
        }

        if (timeConflict) {
          return res.status(409).json({ // 409 Conflict הוא סטטוס מתאים יותר
            error: {
              message: `קיימת לך כבר קבוצה פעילה ("${existingGroup.groupName}") בזמנים חופפים. לא ניתן ליצור את הקבוצה החדשה.`
            }
          });
        }
      }
    }
    // -------------------------------------------------------------

    // שלב 6: יצירת הקבוצה במסד הנתונים (היה שלב 5)
    const group = await RideGroup.create({
      groupName,
      origin,
      destination,
      days,
      departureTime,
      returnTime,
      capacityTotal,
      estimatedDuration,
      driverId, // השתמשנו במשתנה שהוגדר למעלה
      passengers: [],
      isActive: true,
      groupImageURL,
    });

    // שלב 7: עדכון תפקיד הנהג (ללא שינוי)
    await User.findByIdAndUpdate(driverId, { role: 'DRIVER' });

    res.status(201).json(group);
  } catch (err: any) {
    res.status(400).json({ error: { message: err.message } });
  }
};


// --- פונקציה מעודכנת ---
export const getRideGroups = async (_req: Request, res: Response) => {
  try {
    // שליפת כל הקבוצות הפעילות עם שם הנהג
    const groups = await RideGroup.find({ isActive: true })
      .populate({
        path: 'driverId',
        select: 'userName', // נשלוף רק את שם המשתמש
      });
    // נבנה מערך חדש שבו driverName הוא שם הנהג
    const groupsWithDriverName = groups.map((group: any) => {
      const groupObj = group.toObject();
      return {
        ...groupObj,
        driverName: groupObj.driverId?.userName || '',
      };
    });
    res.json(groupsWithDriverName);
  } catch (err: any) {
    res.status(500).json({ error: { message: 'Failed to fetch ride groups' } }); 
  }
};




// בקובץ src/controllers/ride.controller.ts

// import { Response } from 'express';
import mongoose, {isValidObjectId, startSession} from 'mongoose';
// import { AuthRequest } from '../middleware/authMiddleware'; // ייבוא של טיפוס הבקשה המאומתת שלך
// import { RideGroup } from '../models/rideGroup.model';
// import { User } from '../models/user.model';
import { AuthRequest } from '../middlewares/authMiddleware';

export const leaveGroup = async (req: AuthRequest, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user!._id; // המזהה של המשתמש המחובר מגיע מהמידלוור protect

  // בדיקת תקינות בסיסית של מזהה הקבוצה
  if (!isValidObjectId(groupId)) {
    return res.status(400).json({ error: 'מזהה קבוצה לא תקין.' });
  }

  // התחלת סשן לטרנזקציה - זה מבטיח אטומיות
  const session = await startSession();

  try {
    // התחלת הטרנזקציה
    session.startTransaction();

    // 1. מצא את הקבוצה והמשתמש במקביל כדי לוודא שהם קיימים
    // חשוב להעביר את ה-session לכל פעולת DB בתוך הטרנזקציה
    const group = await RideGroup.findById(groupId).session(session);
    const user = await User.findById(userId).session(session);

    // בדיקות ולידציה
    if (!group) {
      await session.abortTransaction(); // בטל את הטרנזקציה לפני החזרת שגיאה
      return res.status(404).json({ error: 'הקבוצה לא נמצאה.' });
    }
    if (!user) {
      // מקרה קצה מאוד לא סביר, אבל טוב לבדוק
      await session.abortTransaction();
      return res.status(404).json({ error: 'המשתמש לא נמצא.' });
    }

    // ודא שהמשתמש אכן חבר בקבוצה (כדי למנוע בקשות מיותרות)
    const isPassengerInGroup = group.passengers.some(pId => pId.equals(userId));
    if (!isPassengerInGroup) {
      await session.abortTransaction();
      // במקרה שהנתונים לא עקביים (למשל, המשתמש לא בקבוצה אבל לקבוצה יש הפניה אליו), התיקון עדיין יתבצע
      // אבל נחזיר הודעה שהמשתמש כבר לא בקבוצה.
      return res.status(400).json({ error: 'אינך חבר בקבוצה זו.' });
    }

    // 2. בצע את שתי פעולות העדכון
    
    // הסר את מזהה המשתמש ממערך הנוסעים של הקבוצה
    await RideGroup.updateOne(
      { _id: groupId },
      { $pull: { passengers: userId } }
    ).session(session);

    // הסר את אובייקט הקבוצה ממערך הקבוצות של המשתמש
    await User.updateOne(
      { _id: userId },
      { $pull: { joinedGroups: { groupId: new mongoose.Types.ObjectId(groupId) } } }
    ).session(session);

    // עדכן את כל הבוקינגים של המשתמש לקבוצה זו מ-APPROVED ל-CANCELLED
    await (await import('../models/RideBooking')).RideBooking.updateMany(
      { rideGroupId: groupId, passengerId: userId, status: 'APPROVED' },
      { $set: { status: 'CANCELLED' } },
      { session }
    );

    // 3. אם הכל עבר בהצלחה, בצע "Commit" לטרנזקציה
    await session.commitTransaction();

    res.status(200).json({ message: 'יצאת מהקבוצה בהצלחה.' });

  } catch (error) {
    // 4. אם משהו נכשל באמצע, בצע "Abort" כדי לבטל את כל השינויים שבוצעו
    await session.abortTransaction();
    console.error('שגיאה בעת עזיבת קבוצה:', error);
    res.status(500).json({ error: 'שגיאה פנימית בשרת, לא ניתן היה לעזוב את הקבוצה.' });
  } finally {
    // 5. לסיום, תמיד סגור את הסשן
    session.endSession();
  }
};











// בקובץ src/controllers/ride.controller.ts

export const closeGroup = async (req: AuthRequest, res: Response) => {
  const { groupId } = req.params;
  const driverId = req.user!._id; // מזהה הנהג מהטוקן

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: 'מזהה קבוצה לא תקין.' });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. מצא את הקבוצה וודא שהמבקש הוא הנהג שלה
    const group = await RideGroup.findById(groupId).session(session);

    if (!group) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'הקבוצה לא נמצאה.' });
    }
    
    // בדיקת הרשאה: האם המשתמש המחובר הוא באמת הנהג של הקבוצה?
    if (!group.driverId.equals(driverId)) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'אינך מורשה לסגור קבוצה זו.' });
    }

    // בדיקה למניעת פעולה כפולה
    if (!group.isActive) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'הקבוצה כבר לא פעילה.' });
    }

    // 2. עדכן את סטטוס הקבוצה ללא פעילה
    group.isActive = false;
    await group.save({ session }); // שמירה עם הסשן של הטרנזקציה

    // 3. הסר את הקבוצה ממערך הקבוצות של כל הנוסעים
    // נשתמש ב-updateMany לביצוע הפעולה בפקודה אחת יעילה מול בסיס הנתונים
    const passengerIds = group.passengers;

    if (passengerIds && passengerIds.length > 0) {
        await User.updateMany(
            { _id: { $in: passengerIds } }, // תנאי: עדכן את כל המשתמשים שהמזהה שלהם נמצא במערך הנוסעים
            { $pull: { joinedGroups: { groupId: group._id } } }, // פעולה: שלוף את האובייקט הרלוונטי ממערך joinedGroups
            { session } // בצע את הפעולה כחלק מהטרנזקציה
        );
    }
    
    // 4. בצע Commit לכל השינויים אם הגענו לכאן ללא שגיאות
    await session.commitTransaction();

    res.status(200).json({ message: `הקבוצה '${group.groupName}' נסגרה בהצלחה.` });

  } catch (error) {
    // אם הייתה שגיאה כלשהי, בטל את כל השינויים
    await session.abortTransaction();
    console.error('שגיאה בסגירת קבוצה:', error);
    res.status(500).json({ error: 'שגיאה פנימית בשרת, לא ניתן היה לסגור את הקבוצה.' });
  } finally {
    // תמיד סיים את הסשן כדי לשחרר משאבים
    session.endSession();
  }
};