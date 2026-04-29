import { Router } from 'express';
import { CallbackController } from '../controllers/callbackController.js';
import { ipWhitelist } from '../middleware/ipWhitelist.js';

const router = Router();

// Standard callback from Hubtel
router.post('/', ipWhitelist, CallbackController.handleHubtelCallback);

// Disbursement specific callback if Hubtel uses different URLs
router.post('/disbursement', ipWhitelist, CallbackController.handleHubtelCallback);

// Reliable processing via QStash
router.post('/process', CallbackController.processCallback);

export default router;
