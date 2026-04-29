import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';

// Define mocks before importing app
jest.unstable_mockModule('../services/checkoutService.js', () => ({
  CheckoutService: {
    initiatePayment: jest.fn(() => Promise.resolve({
      transactionId: '123',
      status: 'pending',
      message: 'Success',
      metadata: {}
    })),
    checkStatus: jest.fn(() => Promise.resolve({
      transactionId: '123',
      status: 'success',
      message: 'Status retrieved',
      metadata: {}
    }))
  }
}));

describe('Checkout Controller', () => {
  it('POST /api/v1/checkout/initiate should return 200', async () => {
    const { default: app } = await import('../index.js');
    const res = await request(app)
      .post('/api/v1/checkout/initiate')
      .send({
        amount: 10,
        customerName: 'Test',
        customerMsisdn: '0244000000',
        description: 'Test',
        clientReference: 'ref'
      });

    expect(res.status).toBe(200);
    expect(res.body.transactionId).toBe('123');
  });

  it('GET /api/v1/checkout/status/:id should return 200', async () => {
    const { default: app } = await import('../index.js');
    const res = await request(app).get('/api/v1/checkout/status/123');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
