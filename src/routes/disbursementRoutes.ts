import { Router } from 'express';
import { DisbursementController } from '../controllers/disbursementController.js';

const router = Router();

router.post('/single', DisbursementController.initiateSingle);
router.post('/batch', DisbursementController.initiateBatch);
router.get('/status/:transactionId', DisbursementController.status);

export default router;
