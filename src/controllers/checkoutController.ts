import { Request, Response, NextFunction } from 'express';
import { CheckoutService } from '../services/checkoutService.js';
import { z } from 'zod';

const initiateCheckoutSchema = z.object({
  amount: z.number().positive(),
  customerName: z.string(),
  customerMsisdn: z.string(),
  customerEmail: z.string().email().optional(),
  description: z.string(),
  clientReference: z.string(),
  callbackUrl: z.string().url().optional(),
  returnUrl: z.string().url().optional(),
  cancellationUrl: z.string().url().optional(),
});

export class CheckoutController {
  static async initiate(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = initiateCheckoutSchema.parse(req.body);
      const result = await CheckoutService.initiatePayment(validatedData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async status(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;
      const result = await CheckoutService.checkStatus(transactionId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
