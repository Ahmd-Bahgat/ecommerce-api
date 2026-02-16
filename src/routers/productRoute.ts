import express from "express";
import asyncHandler from "../utils/asyncHandler";
import { zProductSchema } from "../validation/productValidation";
import { addProduct, getAllProduct } from "../services/productService";
import AppError from "../utils/appError";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await getAllProduct();
    if (!result || result.statusCode === undefined) {
      throw new AppError('Get all product faild', 400)
    }
    const { statusCode, data } = result;
    res.status(statusCode).json(data);
  }),
);

router.post(
  "/addProduct",
  asyncHandler(async (req, res) => {
    const product = zProductSchema.safeParse(req.body);
    if (!product.success) {
      throw new AppError(`${product.error}`, 400)
    }
    const result = await addProduct(product.data);
    if (!result || result.statusCode === undefined) {
      throw new AppError('Add product faild', 400)
    }
    res.status(result.statusCode).json(result.data);
  }),
);

export default router;
