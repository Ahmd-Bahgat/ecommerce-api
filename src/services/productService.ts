import { ProductModel } from "../models/productModel";
import AppError from "../utils/appError";
import { IProduct } from "../validation/productValidation";

export const getAllProduct = async () => {
  const products = await ProductModel.find();
  if (products.length === 0) {
    throw new AppError("not found any product", 404);
  }
  return { statusCode: 200, data: { message: "product found", products } };
};

export const addProduct = async ({ title, image, price, stock }: IProduct) => {
  const findProduct = await ProductModel.findOne({ title });
  if (findProduct) {
    throw new AppError("Product already exists", 400);
  }

  const newProduct = new ProductModel({ title, image, price, stock });
  await newProduct.save();
  return {
    statusCode: 201,
    data: { message: "Product added successfully", newProduct },
  };
};
