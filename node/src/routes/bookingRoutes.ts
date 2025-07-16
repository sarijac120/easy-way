import { Router } from 'express';
import { createBooking, getDriverPendingBookings, getMyBookings, updateBookingStatus, cancelBooking } from '../controllers/bookingController';
import { protect } from '../middlewares/authMiddleware';
import { isGroupDriver } from '../middlewares/isDriverAuth';

const router = Router();

router.post('/', protect, createBooking); // נדרש טוקן
router.get('/my-bookings', protect, getMyBookings); // מוגן ע"י טוקן
router.patch('/:bookingId/status', protect, isGroupDriver, updateBookingStatus);
router.get('/driver/pending', protect, getDriverPendingBookings);
// router.patch('/:bookingId/status',protect,isGroupDriver,updateBookingStatus);
router.patch('/:bookingId/cancel', protect, cancelBooking);

export default router;