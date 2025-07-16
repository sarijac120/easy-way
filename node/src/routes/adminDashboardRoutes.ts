import { Router } from 'express';
// import { getAllUsers, getAllRideGroups, getAllRideBookings } from '../controllers/admin.controller';
import { isAdminAuth } from '../middlewares/isAdminAuth';
import { getAllRideBookings, getAllRideGroups, getAllUsers } from '../controllers/adminDashboard';
import { protect } from '../middlewares/authMiddleware';

const adminRouter = Router();

adminRouter.use(protect,isAdminAuth);

adminRouter.get('/users', getAllUsers);
adminRouter.get('/groups', getAllRideGroups);
adminRouter.get('/bookings', getAllRideBookings);


export default adminRouter;