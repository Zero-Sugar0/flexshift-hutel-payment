import { hubtelClient } from './hubtelClient.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

export interface DisbursementPayload {
  amount: number;
  destination: string; // Phone number or Bank account
  accountName: string;
  channel: string; // e.g., 'mtn-gh', 'vodafone-gh', 'airtel-gh'
  description: string;
  clientReference?: string;
}

export class DisbursementService {
  private static BASE_URL = `https://api-tpp.hubtel.com/v1/merchantaccount/merchants/${config.HUBTEL_MERCHANT_ACCOUNT_NUMBER}/disbursements`;

  static async initiateSingle(payload: DisbursementPayload) {
    const clientReference = payload.clientReference || crypto.randomUUID();
    const hubtelPayload = {
      amount: payload.amount,
      customerName: payload.accountName,
      customerMsisdn: payload.destination,
      channel: payload.channel,
      description: payload.description,
      primaryCallbackUrl: `${config.APP_BASE_URL}/api/v1/disbursement/callback`,
      clientReference,
    };

    logger.info('Initiating Single Disbursement', { clientReference });

    const response = await hubtelClient.post(`${this.BASE_URL}/single`, hubtelPayload);

    return {
      transactionId: response.data.data?.transactionId || clientReference,
      status: 'pending',
      message: response.data.message || 'Disbursement initiated',
      metadata: response.data.data,
    };
  }

  static async initiateBatch(payloads: DisbursementPayload[]) {
    const batchReference = crypto.randomUUID();
    const hubtelPayload = {
      batchReference,
      disbursements: payloads.map(p => ({
        amount: p.amount,
        customerName: p.accountName,
        customerMsisdn: p.destination,
        channel: p.channel,
        description: p.description,
        clientReference: p.clientReference || crypto.randomUUID(),
      })),
      primaryCallbackUrl: `${config.APP_BASE_URL}/api/v1/disbursement/callback`,
    };

    logger.info('Initiating Batch Disbursement', { batchReference, count: payloads.length });

    const response = await hubtelClient.post(`${this.BASE_URL}/batch`, hubtelPayload);

    return {
      transactionId: batchReference,
      status: 'pending',
      message: response.data.message || 'Batch disbursement initiated',
      metadata: response.data.data,
    };
  }

  static async checkStatus(transactionId: string) {
    // Note: Some Hubtel APIs use transactionId, others use clientReference
    const url = `${this.BASE_URL}/status?transactionId=${transactionId}`;
    const response = await hubtelClient.get(url);

    return {
      transactionId,
      status: response.data.data?.status?.toLowerCase() || 'unknown',
      message: response.data.message || 'Status retrieved',
      metadata: response.data.data,
    };
  }
}
