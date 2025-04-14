import express, { Router } from 'express';
import upload from '../middlewares/upload-file-middleware';
import requireAuth from '../middlewares/require-authentication';
import { placeOrder } from '../controllers/place-order-controller';

const router: Router = express.Router({
  caseSensitive: true,
  strict: true,
});

router.post("/", requireAuth, upload.single('payment_screenshot'), placeOrder);

export default router;
