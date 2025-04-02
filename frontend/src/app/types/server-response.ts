interface ServerResponseData<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export default ServerResponseData;
