import { Request, Response, NextFunction } from 'express';
import pool from '../utilities/database-connection';
import createError from '../utilities/create-error';
import ErrorCodes from '../types/error-codes';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  product_image_url: string;
  popular: boolean;
};

const getAllProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Test"
  });
};

const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const { product_name } = req.params;

  // convert words with - in middle to words acceptable in database.
  const productNameInDatabase: string = product_name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  try {
    const [result] = await connection.query(`
      SELECT
      *
      FROM
      products
      WHERE
      name=?
    `, [productNameInDatabase]);

    const productDetails = result as Product[];

    if (productDetails.length === 0) {
      return next(createError(404, "Product not found!", ErrorCodes.ER_PRODUCT_NOT_FOUND));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product fetched successfully!",
      data: productDetails[0]
    });
  }
  catch (error: any) {
    return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
  }
  finally {
    connection.release();
  }
};

export { getAllProductDetails, getProductDetails };
