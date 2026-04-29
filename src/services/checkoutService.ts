import { hubtelClient } from './hubtelClient.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

export interface CheckoutPayload {
  amount: number;
  customerName: string;
  customerMsisdn: string;
  customerEmail?: string;
  description: string;
  clientReference: string;
  callbackUrl?: string;
  returnUrl?: string;
  cancellationUrl?: string;
}

export class CheckoutService {
  private static BASE_URL = 'https://payproxyapi.hubtel.com/items/initiate';

  static async initiatePayment(payload: CheckoutPayload) {
    const hubtelPayload = {
      totalAmount: payload.amount,
      description: payload.description,
      callbackUrl: payload.callbackUrl || `${config.APP_BASE_URL}/api/v1/callback`,
      returnUrl: payload.returnUrl,
      cancellationUrl: payload.cancellationUrl,
      merchantAccountNumber: config.HUBTEL_MERCHANT_ACCOUNT_NUMBER,
      clientReference: payload.clientReference,
    };

    logger.info('Initiating Hubtel Checkout', { clientReference: payload.clientReference });

    const response = await hubtelClient.post(this.BASE_URL, hubtelPayload);

    return {
      transactionId: response.data.data?.transactionId || response.data.data?.checkoutId,
      status: 'pending',
      message: response.data.message || 'Checkout initiated',
      metadata: response.data.data,
    };
  }

  static async checkStatus(transactionId: string) {
    const url = `https://payproxyapi.hubtel.com/items/status/${transactionId}`;
    const response = await hubtelClient.get(url);

    return {
      transactionId,
      status: response.data.data?.status?.toLowerCase() || 'unknown',
      message: response.data.message || 'Status retrieved',
      metadata: response.data.data,
    };
  }
}
