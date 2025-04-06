import { Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';
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
        maxAge: 20 * 60 * 1000,
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

const addCartItems = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const user = req.user;
  const { product_id } = req.body;

  try {
    const [rows] = await connection.query(`
      SELECT
      *
      FROM
      user_cart
      WHERE
      user_id=?
      AND
      product_id=?
    `, [user?.id, product_id]);

    const result = rows as CartItemFromDatabase[];

    // The product does not exist.
    if (result.length === 0) {
      const [insertResult] = await connection.query(`
        INSERT
        INTO
        user_cart(user_id, product_id, quantity)
        VALUES(?, ?, ?)
      `, [user?.id, product_id, 1]);

      if (req.token) {
        res.cookie('token', req.token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 20 * 60 * 1000,
          path: '/'
        });
      }

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Item added to cart!"
      });
    }
    else {
      const prevItemQuantity = result[0].quantity;

      const [updateResult] = await connection.query<ResultSetHeader>(`
        UPDATE user_cart
        SET quantity=?
        WHERE
        user_id=? AND product_id=?
      `, [prevItemQuantity + 1, user?.id, product_id]);

      if (updateResult.affectedRows === 0) {
        return next(createError(500, "Product quantity could not be updated!", ErrorCodes.ER_PRODUCT_QUANTITY_NOT_UPDATED));
      }

      if (req.token) {
        res.cookie('token', req.token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 20 * 60 * 1000,
          path: '/'
        });
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Item added to cart!"
      });
    }
  }
  catch (error: any) {
    return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
  }
  finally {
    connection.release();
  }
};

const updateCartItems = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const user = req.user;
  const { quantity, product_id } = req.body;

  try {
    const [selectRows] = await connection.query(`
      SELECT
      *
      FROM
      user_cart
      WHERE
      user_id=? AND product_id=?
    `, [user?.id, product_id]);

    const selectResult = selectRows as CartItemFromDatabase[];

    if (selectResult.length === 0) {
      return next(createError(404, "The product does not exist!", ErrorCodes.ER_PRODUCT_DOES_NOT_EXIST));
    }

    const [updateResult] = await connection.query<ResultSetHeader>(`
      UPDATE
      user_cart
      SET
      quantity=?
      WHERE
      user_id=? AND product_id=?
    `, [quantity, user?.id, product_id]);

    if (updateResult.affectedRows === 0) {
      return next(createError(500, "Product quantity could not be updated!", ErrorCodes.ER_PRODUCT_QUANTITY_NOT_UPDATED));
    }

    if (req.token) {
      res.cookie('token', req.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 20 * 60 * 1000,
        path: '/'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Item quantity updated!"
    });
  }
  catch (error: any) {
    return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
  }
  finally {
    connection.release();
  }
};

const deleteCartItems = (req: RequestWithUser, res: Response, next: NextFunction) => {
};

export { getCartItems, addCartItems, updateCartItems, deleteCartItems };
