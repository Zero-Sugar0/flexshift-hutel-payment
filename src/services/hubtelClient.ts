import axios from 'axios';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

const authHeader = Buffer.from(`${config.HUBTEL_CLIENT_ID}:${config.HUBTEL_CLIENT_SECRET}`).toString('base64');

export const hubtelClient = axios.create({
  headers: {
    Authorization: `Basic ${authHeader}`,
    'Content-Type': 'application/json',
  },
});

hubtelClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      logger.error('Hubtel API Error', { data: error.response.data });
    }
    return Promise.reject(error);
  }
);
