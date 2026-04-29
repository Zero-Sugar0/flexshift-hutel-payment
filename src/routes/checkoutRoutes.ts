import { Router } from 'express';
import { CheckoutController } from '../controllers/checkoutController.js';

const router = Router();

router.post('/initiate', CheckoutController.initiate);
router.get('/status/:transactionId', CheckoutController.status);

export default router;
