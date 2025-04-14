import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import CustomError from './types/custom-error';

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: [
    "GET",
    "POST",
    "DELETE",
    "PATCH",
  ],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

const port = process.env.PORT;

import authRouter from './routes/auth-route';
import cartRouter from './routes/cart-route';
import productRouter from './routes/product-route';
import placeOrderRouter from './routes/place-order-route';

app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/product', productRouter);
app.use('/api/place-order', placeOrderRouter);

const errorHandlerMiddleware: ErrorRequestHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error!";
  const errorCode = error.errorCode || "ER_UNEXP";

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    errorCode: errorCode
  });
};

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
