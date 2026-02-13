import { CartModel } from "../models/cartModel";
import { ProductModel } from "../models/productModel";

interface CreateCartForUser {
  userId: string;
}
const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = new CartModel({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

export const getActiveCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await CartModel.findOne({ userId, status: "active" });
  if (!cart) {
    return createCartForUser({ userId });
  }
  return cart;
};

export const addItemToCart = async ({ userId, productId, quantity }) => {
  const cart = await getActiveCartForUser({ userId });

  const product = await ProductModel.findById(productId);
  if (!product) {
    return {
      statusCode: 404,
      data: "Product not found",
    };
  }
  const unitPrice = product.price ?? 0;
  const qty = quantity ?? 1;

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId,
  );
  if (existsInCart) {
    if(product.stock < quantity || product.stock === 0){
      return {
        statusCode: 400,
        data: "low stock ",
      };
    }
    existsInCart.quantity += qty;
    product.stock -= qty;
    await product.save()
    cart.totalAmount += existsInCart.unitPrice * qty;
    const updatedCart = await cart.save();
    return {
      statusCode: 200,
      data: updatedCart,
    };
  }
  if (product.stock < quantity || product.stock === 0) {
    return {
      statusCode: 400,
      data: "low stock ",
    };
  }

  cart.items.push({ product: productId, unitPrice, quantity: qty });
  product.stock -= qty;
  await product.save()
  cart.totalAmount += unitPrice * qty;
  const updatedCart = await cart.save();
  return {
    statusCode: 200,
    data: updatedCart,
  };
};
