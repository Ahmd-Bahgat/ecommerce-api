import { CartModel } from "../models/cartModel"

interface CreateCartForUser{
    userId: string
}
const createCartForUser = async ({userId}: CreateCartForUser) => {
    const cart = new CartModel({userId,totalAmount:0})
    await cart.save()
    return cart
}

export const getActiveCartForUser =  async ({userId}:CreateCartForUser) => {
    const cart = await CartModel.findOne({userId, status: "active"})
    if(!cart){
        return createCartForUser({userId})
    }
    return cart
}