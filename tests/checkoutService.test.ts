import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CheckoutService } from '../src/services/checkoutService.js';
import { hubtelClient } from '../src/services/hubtelClient.js';

// Mocking axios instance
jest.mock('../src/services/hubtelClient.js', () => ({
  hubtelClient: {
    post: jest.fn(() => Promise.resolve({
      data: {
        message: 'Success',
        data: {
          transactionId: '12345',
          checkoutId: '12345',
          checkoutUrl: 'http://checkout.url'
        }
      }
    })),
    get: jest.fn(() => Promise.resolve({
      data: {
        message: 'Success',
        data: {
          status: 'Success'
        }
      }
    })),
    interceptors: {
      response: { use: jest.fn() }
    }
  }
}));

describe('CheckoutService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate a payment correctly', async () => {
    const payload = {
      amount: 10,
      customerName: 'Test User',
      customerMsisdn: '0244000000',
      description: 'Test Payment',
      clientReference: 'ref123'
    };

    const result = await CheckoutService.initiatePayment(payload);

    expect(result.transactionId).toBe('12345');
    expect(result.status).toBe('pending');
    expect(hubtelClient.post).toHaveBeenCalled();
  });

  it('should check status correctly', async () => {
    const result = await CheckoutService.checkStatus('12345');

    expect(result).toEqual({
      transactionId: '12345',
      status: 'success',
      message: 'Success',
      metadata: { status: 'Success' }
    });
    expect(hubtelClient.get).toHaveBeenCalled();
  });
});
