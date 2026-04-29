import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DisbursementService } from '../src/services/disbursementService.js';
import { hubtelClient } from '../src/services/hubtelClient.js';

// Mocking axios instance
jest.mock('../src/services/hubtelClient.js', () => ({
  hubtelClient: {
    post: jest.fn(() => Promise.resolve({
      data: {
        message: 'Success',
        data: {
          transactionId: 'TXN-123'
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

describe('DisbursementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate a single disbursement correctly', async () => {
    const payload = {
      amount: 50,
      destination: '0244000000',
      accountName: 'Test Recipient',
      channel: 'mtn-gh',
      description: 'Test Payout'
    };

    const result = await DisbursementService.initiateSingle(payload);

    expect(result.transactionId).toBe('TXN-123');
    expect(result.status).toBe('pending');
    expect(hubtelClient.post).toHaveBeenCalled();
  });

  it('should initiate a batch disbursement correctly', async () => {
    const payloads = [
      {
        amount: 10,
        destination: '0244000001',
        accountName: 'User 1',
        channel: 'mtn-gh',
        description: 'Payout 1'
      }
    ];

    const result = await DisbursementService.initiateBatch(payloads);

    expect(result.status).toBe('pending');
    expect(hubtelClient.post).toHaveBeenCalled();
  });
});
