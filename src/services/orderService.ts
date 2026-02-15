import { OrderModel } from "../models/orderModel";
import { ProductModel } from "../models/productModel";
import { getActiveCartForUser } from "./cartService";

export const checkout = async ({ userId, address }) => {
  const cart = await getActiveCartForUser({ userId });
  if (!cart) {
    return { statusCode: 404, data: "Cart not found" };
  }

  //check and update stock

  //   for(const item of cart.items){
  //     const product = await ProductModel.findById(item.productId)
  //     if(!product){
  //         return {
  //             statusCode: 404,
  //             data: "Product not found"
  //         }
  //     }
  //     if(product.stock < item.quantity){
  //         return {
  //             statusCode: 400,
  //             data: "Product stock is not enough"
  //         }
  //     }
  //     product.stock -= item.quantity;
  //     await product.save();
  //   }

  const orderItemsPromise = cart.items.map(async (item) => {
    const product = await ProductModel.findById(item.productId);
    if (!product) {
      return { statusCode: 404, data: "Product not found" };
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
  return { statusCode: 200, data: order };
};
