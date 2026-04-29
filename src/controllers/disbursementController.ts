import { Request, Response, NextFunction } from 'express';
import { DisbursementService } from '../services/disbursementService.js';
import { z } from 'zod';

const disbursementSchema = z.object({
  amount: z.number().positive(),
  destination: z.string(),
  accountName: z.string(),
  channel: z.string(),
  description: z.string(),
  clientReference: z.string().optional(),
});

const batchDisbursementSchema = z.array(disbursementSchema);

export class DisbursementController {
  static async initiateSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = disbursementSchema.parse(req.body);
      const result = await DisbursementService.initiateSingle(validatedData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async initiateBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = batchDisbursementSchema.parse(req.body);
      const result = await DisbursementService.initiateBatch(validatedData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async status(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;
      const result = await DisbursementService.checkStatus(transactionId as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
