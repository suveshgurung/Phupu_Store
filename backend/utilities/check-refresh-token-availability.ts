import pool from './database-connection';
import createError from './create-error';
import ErrorCodes from '../types/error-codes';

const checkRefreshTokenAvailability = async (refreshToken: string): Promise<boolean> => {
  const connection = await pool.getConnection();

  try {
    const [checkToken] = await connection.query<any[]>(`
      SELECT
      *
      FROM
      user_refresh_token_list
      WHERE
      refresh_token=?
    `, [refreshToken]);

      // Refresh token is not available.
      if (checkToken.length === 0) {
        return false;
      }

      // Refresh token is available.
      return true;
  }
  catch (error: any) {
    throw createError(500, error.message, ErrorCodes.ER_UNEXP);
  }
  finally {
    connection.release();
  }
};

export default checkRefreshTokenAvailability;
