import dotenv from 'dotenv'
dotenv.config();

import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { dbConnect } from './configs/database.config';

import foodsRouter from './routers/food.router'
import usersRouter from './routers/user.router'
import orderRouter from './routers/order.router'

dbConnect();
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use('/api/foods', foodsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', orderRouter);



const port = 5000;

app.listen(port, () => {});
