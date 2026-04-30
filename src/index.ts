import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import logger from './utils/logger.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import disbursementRoutes from './routes/disbursementRoutes.js';
import callbackRoutes from './routes/callbackRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API Routes
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/disbursement', disbursementRoutes);
app.use('/api/v1/callback', callbackRoutes);

// Error Handling
app.use(errorHandler);

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${config.NODE_ENV} mode`);
});

export default app;
