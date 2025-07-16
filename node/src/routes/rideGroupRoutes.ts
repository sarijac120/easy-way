import { Router } from 'express';
import { closeGroup, createRideGroup, getRideGroups, leaveGroup } from '../controllers/rideGroupController';
import { protect } from '../middlewares/authMiddleware';
import { isGroupDriver, verifyGroupOwnership } from '../middlewares/isDriverAuth';
import { updateBookingStatus } from '../controllers/bookingController';
import { uploadGroupImage } from '../middlewares/uploadGroupImage';

const router = Router();

router.post('/', protect, uploadGroupImage.single('groupImage'), createRideGroup);
router.get('/', getRideGroups);
router.post('/:groupId/leave', protect, leaveGroup);
router.patch('/:groupId/close', protect, verifyGroupOwnership, closeGroup);

export default router;