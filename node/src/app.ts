import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorMiddleware';
import userRoutes from './routes/userRoutes';
import rideGroupRoutes from './routes/rideGroupRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { protect } from './middlewares/authMiddleware';
import 'express-async-errors';
import path from 'path';
import adminRouter from './routes/adminDashboardRoutes';

const app = express();


const corsOptions = {
  origin: 'http://localhost:5173', // או 3001, 5173, וכו'
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/user', userRoutes);
app.use('/api/rideGroup', rideGroupRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRouter);

// Example protected health route
app.get('/api/health', protect, (_req, res) => res.json({ status: 'ok' }));
// app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
// --- שנה את הגדרת התיקייה הסטטית לקוד הבא ---
app.use('/uploads', (req, res, next) => {
  // קובע את ה-Content-Type הנכון לפי סיומת הקובץ
  // ורק אז מעביר את הבקשה ל-express.static
  const ext = path.extname(req.path);
  if (ext === '.png') {
    res.setHeader('Content-Type', 'image/png');
  } else if (ext === '.jpg' || ext === '.jpeg') {
    res.setHeader('Content-Type', 'image/jpeg');
  }
  // אפשר להוסיף סוגים נוספים כמו gif, svg וכו'
  
  next(); // המשך ל-middleware הבא
}, express.static(path.join(__dirname, '..', 'public', 'uploads')));

// ... שאר הראוטים ...
app.use(errorHandler);

export default app;