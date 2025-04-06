interface ServerResponseData<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errorCode?: number;
}

export default ServerResponseData;
