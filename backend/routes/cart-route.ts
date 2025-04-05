import express, { Router } from 'express';
import requireAuth from '../middlewares/require-authentication';
import { getCartItems, addCartItems, updateCartItems, deleteCartItems } from '../controllers/cart-controller';

const router: Router = express.Router({
  caseSensitive: true,
  strict: true
});

router.get("/", requireAuth, getCartItems);
router.post("/", requireAuth, addCartItems);
router.patch("/", requireAuth, updateCartItems);
router.delete("/", requireAuth, deleteCartItems);

export default router;
