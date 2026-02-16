import { OrderModel } from "../models/orderModel";
import { ProductModel } from "../models/productModel";
import { getActiveCartForUser } from "./cartService";
import AppError from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";

export const checkout = async ({ userId, address }) => {
  const cart = await getActiveCartForUser({ userId });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  if(cart.items.length === 0){
    throw new AppError('Cart is empty', 400)
  }

  const orderItemsPromise = cart.items.map(async (item) => {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return {
      productTitle: product.title,
      productImage: product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    };
  });
  const orderItems = await Promise.all(orderItemsPromise);
  const order = await OrderModel.create({
    orderItems,
    address,
    total: cart.totalAmount,
    userId,
  });
  cart.status = "complete";
  await cart.save();
  return {
    statusCode: 200,
    data: order 
  };
};
