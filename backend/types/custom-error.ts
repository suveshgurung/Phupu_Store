class CustomError extends Error {
  statusCode: number;
  errorCode: string;
  // errorCode values:
  // ER_UNEXP -> unexpected error
  // ER_EMAIL_EXISTS -> provided email exists
  // ER_PN_EXISTS -> provided phone number exists

  constructor(statusCode: number, message: string, errorCode: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
