import CustomError from '../types/custom-error';

type createErrorFunction = (statusCode: number, message: string, errorCode: string) => CustomError;

const createError: createErrorFunction = (statusCode: number, message: string, errorCode: string): CustomError => {
  return new CustomError(statusCode, message, errorCode);
}
export default createError;
