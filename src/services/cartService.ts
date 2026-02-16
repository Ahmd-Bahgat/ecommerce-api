import { CartModel } from "../models/cartModel";
import { ProductModel } from "../models/productModel";
import AppError from "../utils/appError";

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
    throw new AppError('Product not found', 404)
  }
  const unitPrice = product.price ?? 0;
  const qty = quantity ?? 1;

  const existsInCart = cart.items.find(
    (p) => p.productId.toString() === productId,
  );
  if (existsInCart) {
    if (product.stock < qty || product.stock === 0) {
      throw new AppError('Low stock', 400)
    }
    existsInCart.quantity += qty;
    product.stock -= qty;
    await product.save();
    cart.totalAmount += existsInCart.unitPrice * qty;
    const updatedCart = await cart.save();
    return {
      statusCode: 200,
      data: updatedCart,
    };
  }
  if (product.stock < qty || product.stock === 0) {
    throw new AppError('Low stock', 400)
  }

  cart.items.push({ productId, unitPrice, quantity: qty });
  product.stock -= qty;
  await product.save();
  cart.totalAmount += unitPrice * qty;
  const updatedCart = await cart.save();
  return {
    statusCode: 200,
    data: updatedCart,
  };
};

export const updateCartItem = async ({ userId, productId, quantity }) => {
  const cart = await getActiveCartForUser({ userId });
  const existsInCart = cart.items.find(
    (p) => p.productId.toString() === productId,
  );
  if (!existsInCart) {
    throw new AppError('Item not found', 404)
  }
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404)
  }
  const oldQuantity = existsInCart.quantity;
  const reqQuantity = quantity - oldQuantity;
  if (reqQuantity > 0 && product.stock < reqQuantity) {
    throw new AppError('Low stock', 400)
  }
  product.stock -= reqQuantity;
  await product.save();

  const otherCartItem = cart.items.filter(
    (p) => p.productId.toString() !== productId,
  );
  let total = otherCartItem.reduce(
    (sum, product) => (sum += product.quantity * product.unitPrice),
    0,
  );
  existsInCart.quantity = quantity;
  total += existsInCart.quantity * existsInCart.unitPrice;
  cart.totalAmount = total;
  const updatedCart = await cart.save();

  return {
    statusCode: 200,
    data: updatedCart,
  };
};

export const deleteItemInCart = async ({ userId, productId }) => {
  const cart = await getActiveCartForUser({ userId });
  const existsInCart = cart.items.find(
    (p) => p.productId.toString() === productId,
  );
  if (!existsInCart) {
    throw new AppError('Item not found', 400)
  }
  const otherCartItem = cart.items.filter(
    (p) => p.productId.toString() !== productId,
  );
  cart.items = otherCartItem;
  const total = otherCartItem.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404)
  }
  const oldQuantity = existsInCart.quantity;
  product.stock += oldQuantity;
  await product.save();
  cart.totalAmount = total;
  const updatedCart = await cart.save();

  return {
    statusCode: 200,
    data: updatedCart,
  };
};
export const clearCart = async ({ userId }) => {
  const cart = await getActiveCartForUser({ userId });
  if (!cart) {
    throw new AppError('Cart not found', 404)
  }
  for (const item of cart.items) {
    const product = await ProductModel.findById(item.productId);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return {
    statusCode: 200,
    data: updatedCart,
  };
};
