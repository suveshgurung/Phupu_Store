import CustomError from '../types/custom-error';
import ErrorCodes from '../types/error-codes';

type createErrorFunction = (statusCode: number, message: string, errorCode: ErrorCodes) => CustomError;

const createError: createErrorFunction = (statusCode: number, message: string, errorCode: ErrorCodes): CustomError => {
  return new CustomError(statusCode, message, errorCode);
}
export default createError;
