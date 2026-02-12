import express from "express";
import dotenv from "dotenv";
import userRouter from "./src/routers/userRoute";
import productRouter from "./src/routers/productRoute";
import cartRouter from "./src/routers/cartRoute";
import connectDB from "./src/config/db";
import { errorHandler } from "./src/middlewares/errorHandler";
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/user", userRouter);
app.use("/product", productRouter)
app.use('/cart', cartRouter);

//middlewares
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on 0.0.0.0:${port}`);
});
