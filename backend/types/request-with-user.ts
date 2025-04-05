import { Request } from 'express';
import UserInfo from './user-info';

interface RequestWithUser extends Request {
  user?: UserInfo;
  token?: string;
};

export default RequestWithUser;
