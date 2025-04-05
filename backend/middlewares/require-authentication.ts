import { Response, NextFunction } from 'express';
import CryptoJS from 'crypto-js';
import RequestWithUser from '../types/request-with-user';
import checkRefreshTokenAvailability from '../utilities/check-refresh-token-availability';
import createError from '../utilities/create-error';
import ErrorCodes from '../types/error-codes';
import { createToken } from '../utilities/token-generator';

const requireAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { token, refreshToken, user } = req.cookies;

  let decryptedUserInfo;

  if (user) {
    const secretKey = process.env.ENCRYPTION_SECRET_KEY;
    if (!secretKey) {
      return next(createError(500, "Secret key not provided!", ErrorCodes.ER_SECRET_KEY_ABSENT));
    }
    const bytes = CryptoJS.AES.decrypt(user, secretKey);
    decryptedUserInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  if (!token) {
    // Both tokens not available means user in unauthorized.
    if (!refreshToken) {
      return next(createError(401, "Unauthorized!", ErrorCodes.ER_UNAUTHORIZED));
    }

    try {
      const isRefreshTokenAvailable = await checkRefreshTokenAvailability(refreshToken);

      if (isRefreshTokenAvailable === false) {
        return next(createError(403, "Forbidden!", ErrorCodes.ER_FORBIDDEN));
      }

      req.token = createToken(decryptedUserInfo.email);
      req.user = decryptedUserInfo;
    }
    catch (error: any) {
      return next(createError(500, error.message, ErrorCodes.ER_UNEXP));
    }
  }

  req.user = decryptedUserInfo;

  next();
}

export default requireAuth;
