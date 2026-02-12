import mongoose from 'mongoose'
import { productSchema } from './productModel'
import { cartStatusEnum, ICart } from '../validation/cartValidation'

const cartItemSchema = new mongoose.Schema({
    product : productSchema,
    unitPrice : {type: Number, required: true},
    quantity : {type: Number, required: true, default: 1}
})

const cartSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    items : [cartItemSchema],
    totalAmount : {type: Number, required: true},
    status : {type: String, enum: cartStatusEnum, default: "active"}
})

export const CartModel = mongoose.model<ICart>("Cart", cartSchema)