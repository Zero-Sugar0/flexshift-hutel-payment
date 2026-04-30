import { Request, Response, NextFunction } from 'express';
import { Client } from '@upstash/qstash';
import { Receiver } from '@upstash/qstash';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

const qstashClient = new Client({
  token: config.QSTASH_TOKEN,
});

const receiver = new Receiver({
  currentSigningKey: config.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: config.QSTASH_NEXT_SIGNING_KEY,
});

export class CallbackController {
  /**
   * Initial callback from Hubtel.
   * We publish it to QStash for reliable processing.
   */
  static async handleHubtelCallback(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Received callback from Hubtel', { body: req.body });

      // Publish to QStash
      await qstashClient.publishJSON({
        url: `${config.APP_BASE_URL}/api/v1/callback/process`,
        body: req.body,
        retries: 3,
      });

      // Hubtel expects a 200 OK
      res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  }

  /**
   * QStash calls this endpoint to process the callback business logic.
   */
  static async processCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['upstash-signature'] as string;
      const body = (req as any).rawBody?.toString('utf-8') || JSON.stringify(req.body);

      // Verify QStash signature
      const isValid = await receiver.verify({
        signature,
        body,
      });

      if (!isValid) {
        logger.warn('Invalid QStash signature');
        return res.status(401).send('Unauthorized');
      }

      logger.info('Processing callback logic', { body: req.body });

      // Normalize response and handle business logic here
      // Example: Update database, send internal notification, etc.
      // Since we are stateless, we just log it as "Production Ready" practice.

      const normalizedResponse = {
        transactionId: req.body.Data?.TransactionId || req.body.Data?.ClientReference,
        status: req.body.ResponseCode === '0000' || req.body.ResponseCode === '00' ? 'success' : 'failed',
        message: req.body.Data?.Description || 'Callback processed',
        metadata: req.body.Data,
      };

      logger.info('Normalized Callback Result', normalizedResponse);

      res.status(200).json(normalizedResponse);
    } catch (error) {
      next(error);
    }
  }
}
