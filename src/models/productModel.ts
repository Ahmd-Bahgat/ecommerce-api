import mongoose from "mongoose";
import { IProduct } from "../validation/productValidation";

export const productSchema = new mongoose.Schema<IProduct>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

export const ProductModel = mongoose.model("Product", productSchema);
