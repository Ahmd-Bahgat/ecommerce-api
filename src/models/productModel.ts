import mongoose from "mongoose";
import { IProduct } from "../validation/productValidation";

export const productSchema = new mongoose.Schema<IProduct>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  stok: { type: Number, required: true, default: 0 },
});

export const productModel = mongoose.model("Product", productSchema);
