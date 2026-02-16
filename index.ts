import express from "express";
import dotenv from "dotenv";
import userRouter from "./src/routers/userRoute";
import productRouter from "./src/routers/productRoute";
import cartRouter from "./src/routers/cartRoute";
import orderRouter from "./src/routers/orderRoute";
import connectDB from "./src/config/db";
import errorHandler from "./src/middlewares/errorHandler";
import AppError from "./src/utils/appError";
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/user", userRouter);
app.use("/product", productRouter)
app.use('/cart', cartRouter);
app.use('/order', orderRouter)

app.use((req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server `, 404))
})
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on 0.0.0.0:${port}`);
});
