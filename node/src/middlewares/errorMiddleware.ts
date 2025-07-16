import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    },
  });
};