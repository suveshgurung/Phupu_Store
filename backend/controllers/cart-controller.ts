import { Request, Response, NextFunction } from 'express';
import RequestWithUser from '../types/request-with-user';
import pool from '../utilities/database-connection';
import createError from '../utilities/create-error';
import ErrorCodes from '../types/error-codes';

interface CartItemFromDatabase {
  'S.N.': number;
  user_id: number;
  product_id: number;
  quantity: number;
};

interface CartItemDataToSend {
  product_id: number;
  quantity: number;
};

const getCartItems = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const user = req.user;

  try {
    const [rows] = await connection.query(`
      SELECT
      *
      FROM
      user_cart
      WHERE
      user_id=?
    `, [user?.id]);

    const result = rows as CartItemFromDatabase[];

    const cartItems: CartItemDataToSend[] = result.map(({ product_id, quantity }) => (
      {
        product_id,
        quantity
      }
    ));

    if (req.token) {
      res.cookie('token', req.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Cart items successfully extracted!",
      data: cartItems
    });
  }
  catch (error: any) {
    return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
  }
  finally {
    connection.release();
  }
};

const addCartItems = (req: Request, res: Response, next: NextFunction) => {
};

const updateCartItems = (req: Request, res: Response, next: NextFunction) => {
};

const deleteCartItems = (req: Request, res: Response, next: NextFunction) => {
};

export { getCartItems, addCartItems, updateCartItems, deleteCartItems };
