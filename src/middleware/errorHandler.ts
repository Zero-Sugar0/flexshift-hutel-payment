import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public data?: any) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Error occurred', {
    message,
    stack: err.stack,
    data: err.data || err.response?.data,
  });

  res.status(statusCode).json({
    transactionId: err.data?.transactionId || null,
    status: 'error',
    message,
    metadata: err.data || err.response?.data || null,
  });
};
