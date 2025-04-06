import express, { Router } from 'express';
import { getAllProductDetails, getProductDetails } from '../controllers/product-controller';

const router: Router = express.Router({
  caseSensitive: true,
  strict: true
});

router.get("/", getAllProductDetails);
router.get("/:product_name", getProductDetails);

export default router;
