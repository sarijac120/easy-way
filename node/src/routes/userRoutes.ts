// import { Router } from 'express';
// import { registerUser, loginUser, getMe, updateMe } from '../controllers/userController';
// import { protect } from '../middlewares/authMiddleware';

// const router = Router();

// router.post('/', registerUser);
// router.post('/login', loginUser);
// router.get('/me',protect, getMe);
// router.patch('/me',protect, updateMe);
// export default router;



import { Router } from 'express';
import { registerUser, loginUser, getMe, updateMe, getMyGroups, getMyBookings, changePassword, getMyJoinedGroups } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';
import { verifyEmail } from '../controllers/userController';

const router = Router();

router.post('/', registerUser);
router.post('/login', loginUser);

// נתיבים מאובטחים:
router.get('/me', protect, getMe);
router.patch('/me', protect, updateMe); // ✅ עדכון בפרופיל באמצעות PATCH
router.get('/my-groups', protect, getMyGroups);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/change-password', protect, changePassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/my-joined-groups', protect, getMyJoinedGroups);
// router.get('/joined-groups', protect, getJoinedGroups);

export default router;
