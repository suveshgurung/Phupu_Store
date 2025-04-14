import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import ShortUniqueId from 'short-unique-id';
import pool from '../utilities/database-connection';
import createError from '../utilities/create-error';
import ErrorCodes from '../types/error-codes';
import { createToken, createRefreshToken } from '../utilities/token-generator';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const { emailOrPhoneNumber, password, isEmail } = req.body;

  try {
    if (isEmail === true) {
      const [rows] = await connection.query<any[]>(`
        SELECT *
        FROM users
        WHERE
        email=?`, [emailOrPhoneNumber]);

      if (rows.length === 0) {
        return next(createError(404, "Email not registered!", ErrorCodes.ER_EMAIL_NOT_REG));
      }

      const user = rows[0];

      // compare encrypted password.
      const matchPassword = await bcrypt.compare(password, user.password);
      if (matchPassword === false) {
        return next(createError(401, "Invalid password!", ErrorCodes.ER_INVALID_PASS));
      }

      const token: string = createToken(user.email);
      const refreshToken: string = createRefreshToken(user.email);

      const [result] = await connection.query<any[]>(`
        INSERT INTO
        user_refresh_token_list(user_id, refresh_token)
        VALUES(?, ?)
      `, [user.id, refreshToken]);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 20 * 60 * 1000,
        path: '/'
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });

      const { password: userPassword, created_at, ...restUserInfo} = user;

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Login successfull!",
        data: restUserInfo
      });
    }
    else {
      const [rows] = await connection.query<any[]>(`
        SELECT *
        FROM users
        WHERE
        phone_number=?`, [emailOrPhoneNumber]);

      if (rows.length === 0) {
        return next(createError(404, "Phone number not registered!", ErrorCodes.ER_PN_NOT_REG));
      }

      const user = rows[0];
      
      // compare encrypted password.
      const matchPassword = await bcrypt.compare(password, user.password);
      if (matchPassword === false) {
        return next(createError(401, "Invalid password!", ErrorCodes.ER_INVALID_PASS));
      }
      
      const token: string = createToken(user.email);
      const refreshToken: string = createRefreshToken(user.email);

      const [result] = await connection.query<any[]>(`
        INSERT INTO
        user_refresh_token_list(user_id, refresh_token)
        VALUES(?, ?)
      `, [user.id, refreshToken]);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 20 * 60 * 1000,
        path: '/'
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
      });

      const { password: userPassword, created_at, ...restUserInfo} = user;

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Login successfull!",
        data: restUserInfo
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

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const { full_name, email, phone_number, password } = req.body;

  try {
    const [emailExists] = await connection.query<any[]>(`
      SELECT * FROM users WHERE email=?`, [email]);
    if (emailExists.length != 0) {
      return next(createError(409, "User with the provided email already exists!", ErrorCodes.ER_EMAIL_EXISTS));
    }

    const [phoneNumberExists] = await connection.query<any[]>(`
      SELECT * FROM users WHERE phone_number=?`, [phone_number]);
    if (phoneNumberExists.length != 0) {
      return next(createError(409, "User with the provided phone number already exists!", ErrorCodes.ER_PN_EXISTS));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uid = new ShortUniqueId({ length: 16 });
    const randomUserId = uid.rnd();

    try {
      const [result] = await connection.query<any>(`
        INSERT INTO
        users(id, name, email, password, phone_number)
        VALUES(?, ?, ?, ?, ?)`, [randomUserId, full_name, email, hashedPassword, phone_number]);

        res.status(200).json({
          success: true,
          statusCode: 200,
          message: "Sign up successfull!"
        });
    }
    catch (error: any) {
      throw error;
    }
  }
  catch (error: any) {
    return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
  }
  finally {
    connection.release();
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const { id } = req.params;

  try {
    const [result] = await connection.query(`
      DELETE
      FROM
      user_refresh_token_list
      WHERE
      user_id=?
    `, [id]);

    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.clearCookie("user");

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Logout successfull!"
    });
  }
  catch (error: any) {
    return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
  }
  finally {
    connection.release();
  }
};

export { login, signup, logout };
