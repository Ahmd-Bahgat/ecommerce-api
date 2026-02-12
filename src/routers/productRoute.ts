import express from "express";
import { zProductSchema } from "../validation/productValidation";
import { addProduct, getAllProduct } from "../services/productService";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await getAllProduct();
  if (!result || result.statusCode === undefined) {
    return res.status(400).json({
      message: "get all product faild",
    });
  }
  const { statusCode, data } = result;
  res.status(statusCode).json(data);
});

router.post("/addProduct", async (req, res) => {
  try {
    const product = zProductSchema.safeParse(req.body);
    if (!product.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: product.error,
      });
    }
    const result = await addProduct(product.data);
    if (!result || result.statusCode === undefined) {
      return res.status(400).json({
        message: "add product faild",
      });
    }
    res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
