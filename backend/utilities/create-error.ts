import CustomError from '../types/custom-error';

type createErrorFunction = (statusCode: number, message: string) => CustomError;

const createError: createErrorFunction = (statusCode: number, message: string): CustomError => {
  return new CustomError(statusCode, message);
}
export default createError;
