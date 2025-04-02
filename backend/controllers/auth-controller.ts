import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../utilities/database-connection';
import createError from '../utilities/create-error';
import LoginData from '../types/login-data-type';
import SignupData from '../types/signup-data-type';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query(`
      INSERT INTO users(name, email, phone_number, password)
      VALUES("", "", "", "")
      `);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "WOWOWOWOWOWO"
      });
  }
  catch (error: any) {
    return next(createError(500, error.message));
  }
  finally {
    connection.release();
  }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const connection = await pool.getConnection();
  const { name, email, phone_number, password } = req.body;

  try {
    const [emailExists] = await connection.query<any[]>(`
      SELECT * FROM users WHERE email=?`, [email]);
    if (emailExists.length != 0) {
      return next(createError(409, "User with the provided email already exists!"));
    }

    const [phoneNumberExists] = await connection.query<any[]>(`
      SELECT * FROM users WHERE phone_number=?`, [phone_number]);
    if (phoneNumberExists.length != 0) {
      return next(createError(409, "User with the provided phone number already exists!"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const [result] = await connection.query<any>(`
        INSERT INTO
        users(name, email, password, phone_number)
        VALUES(?, ?, ?, ?)`, [name, email, hashedPassword, phone_number]);

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
    return next(error);
  }
  finally {
    connection.release();
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
};

export { login, signup, logout };
