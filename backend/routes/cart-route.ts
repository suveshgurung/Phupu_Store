import express, { Router } from 'express';
import requireAuth from '../middlewares/require-authentication';
import { getCartItems, addCartItems, updateCartItems, deleteCart, deleteCartItems } from '../controllers/cart-controller';

const router: Router = express.Router({
  caseSensitive: true,
  strict: true
});

router.get("/", requireAuth, getCartItems);
router.post("/", requireAuth, addCartItems);
router.patch("/", requireAuth, updateCartItems);
// delete the whole cart of a user.
router.delete("/", requireAuth, deleteCart);
// delete a specific product.
router.delete("/:product_id", requireAuth, deleteCartItems);

export default router;
