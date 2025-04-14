import { Response, NextFunction } from 'express';
import ShortUniqueId from 'short-unique-id';
import pool from '../utilities/database-connection';
import createError from '../utilities/create-error';
import RequestWithUser from '../types/request-with-user';
import ErrorCodes from '../types/error-codes';

interface SimplifiedCartItems {
  product_id: number;
  quantity: number;
};

const placeOrder = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { full_name, email, phone_number, payment_method, district, address, landmark } = req.body;
  const cartItems: SimplifiedCartItems[] = JSON.parse(req.body.cart_items);

  const connection = await pool.getConnection();
  const user = req.user;

  const uid = new ShortUniqueId({ length: 32 });

  try {
    let fileUrl: string | null = null;
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const randomOrderId = uid.rnd();

    if (fileUrl) {
      cartItems.map(async (item) => {
        const [result] = await connection.query<any[]>(`
          INSERT
          INTO
          order_details(order_id, user_id, product_id, quantity, full_name, email, phone_number, payment_method, district, address, landmark, payment_screenshot)
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [randomOrderId, user?.id, item.product_id, item.quantity, full_name, email, phone_number, payment_method, district, address, landmark ? landmark : null, fileUrl]);
      });
    }
    else {
      cartItems.map(async (item) => {
        const [result] = await connection.query<any[]>(`
          INSERT
          INTO
          order_details(order_id, user_id, product_id, quantity, full_name, email, phone_number, payment_method, district, address, landmark)
          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [randomOrderId, user?.id, item.product_id, item.quantity, full_name, email, phone_number, payment_method, district, address, landmark ? landmark : null]);
      });
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
      message: "Order placed successfully"
    });
  }
  catch (error: any) {
    return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
  }
  finally {
    connection.release();
  }
}

export { placeOrder };
