import { ProductModel } from "../models/productModel";
import { IProduct } from "../validation/productValidation";

export const getAllProduct = async () => {
  try {
    const products = await ProductModel.find();
    if (products.length === 0) {
      return { statusCode: 404, data: "not found any product" };
    }
    return { statusCode: 200, data: { message: "product found", products } };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addProduct = async ({ title, image, price, stock }: IProduct) => {
  try {
    const findProduct = await ProductModel.findOne({ title });
    if (findProduct) return { statusCode: 400, data: "product already exists" };

    const newProduct = new ProductModel({ title, image, price, stock });
    await newProduct.save();
    return {
      statusCode: 201,
      data: { message: "Product added successfully", newProduct },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
