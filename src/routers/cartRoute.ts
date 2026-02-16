import express from "express";
import asyncHandler from "../utils/asyncHandler";
import { validateJWT } from "../middlewares/validateJWT";
import {
  addItemToCart,
  clearCart,
  deleteItemInCart,
  getActiveCartForUser,
  updateCartItem,
} from "../services/cartService";
import { zCartItemSchema } from "../validation/cartValidation";

const router = express.Router();

router.get(
  "/",
  validateJWT,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }
    const cart = await getActiveCartForUser({ userId });
    res.status(200).json({
      message: "Cart found",
      cart,
    });
  }),
);

// to validation
const validate = zCartItemSchema.pick({ productId: true, quantity: true });

router.post(
  "/item",
  validateJWT,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const result = validate.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.message,
      });
    }
    const { productId, quantity } = result.data;
    const { statusCode, data } = await addItemToCart({
      userId,
      productId,
      quantity,
    });
    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: data,
      });
    }
    res.status(statusCode).json({
      message: "added to cart",
      data,
    });
  }),
);

router.put(
  "/item",
  validateJWT,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const result = validate.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.message,
      });
    }
    const { productId, quantity } = result.data;
    const { statusCode, data } = await updateCartItem({
      userId,
      productId,
      quantity,
    });
    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: data,
      });
    }
    res.status(statusCode).json({
      message: "updated cart",
      data,
    });
  }),
);

// delete item form cart
router.delete(
  "/item/:id",
  validateJWT,
  asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const userId = req.userId;
    const { statusCode, data } = await deleteItemInCart({ userId, productId });
    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: data,
      });
    }
    res.status(statusCode).json({
      message: "deleted from cart",
      data,
    });
  }),
);

// clear cart
router.delete(
  "/",
  validateJWT,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { statusCode, data } = await clearCart({ userId });
    if (statusCode !== 200) {
      return res.status(statusCode).json({
        message: data,
      });
    }
    res.status(statusCode).json({
      message: "cart cleared",
      data,
    });
  }),
);

export default router;
