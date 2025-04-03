import jwt from 'jsonwebtoken';

export const createToken = (email: string): string => {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not provided");
  }
  const token: string = jwt.sign({ email }, secretKey, { expiresIn: '20m' });

  return token;
};

export const createRefreshToken = (email: string): string => {
  const secretKey = process.env.REFRESH_SECRET_KEY;
  if (!secretKey) {
    throw new Error("REFRESH_SECRET_KEY is not provided");
  }
  const refreshToken: string = jwt.sign({ email }, secretKey);

  return refreshToken;
};
