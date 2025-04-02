import ErrorCodes from './error-codes';

class CustomError extends Error {
  statusCode: number;
  errorCode: ErrorCodes;

  constructor(statusCode: number, message: string, errorCode: ErrorCodes) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
